import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../slice';
import { WithdrawStep } from '../../types';
import { selectBridgeWithdrawPage } from '../../selectors';
import { Chain } from 'types';
import { toNumberFormat } from 'utils/display-text/format';
import { bignumber } from 'mathjs';
import walletIcon from 'assets/images/account_balance_wallet.svg';
import ArrowBack from 'assets/images/genesis/arrow_back.svg';
import iconSuccess from 'assets/images/icon-success.svg';

import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import {
  Stepper,
  StepItem,
} from '../../../BridgeDepositPage/components/Stepper';
import { BridgeNetworkDictionary } from '../../../BridgeDepositPage/dictionaries/bridge-network-dictionary';
import { CrossBridgeAsset } from 'app/pages/BridgeDepositPage/types/cross-bridge-asset';
import { BridgeDictionary } from 'app/pages/BridgeDepositPage/dictionaries/bridge-dictionary';
import { AssetModel } from 'app/pages/BridgeDepositPage/types/asset-model';
import { useHistory } from 'react-router-dom';

const stepOrder = [
  WithdrawStep.CHAIN_SELECTOR,
  WithdrawStep.TOKEN_SELECTOR,
  WithdrawStep.AMOUNT_SELECTOR,
  WithdrawStep.RECEIVER_SELECTOR,
  WithdrawStep.REVIEW,
  WithdrawStep.CONFIRM,
  WithdrawStep.PROCESSING,
  WithdrawStep.COMPLETE,
];

const initialSteps: StepItem[] = [
  { stepTitle: 'Network', value: WithdrawStep.CHAIN_SELECTOR },
  { stepTitle: 'Token', value: WithdrawStep.TOKEN_SELECTOR },
  { stepTitle: 'Amount', value: WithdrawStep.AMOUNT_SELECTOR },
  { stepTitle: 'Address', value: WithdrawStep.RECEIVER_SELECTOR },
  { stepTitle: 'Review', value: WithdrawStep.REVIEW },
  { stepTitle: 'Confirm', value: WithdrawStep.CONFIRM },
  { stepTitle: 'Processing', value: WithdrawStep.PROCESSING },
  { stepTitle: 'Complete', value: WithdrawStep.COMPLETE },
];

// User should be able to go back on steps but not forward (even if moved back,
// unless we are confident that user didn't change anything)
export const SidebarSteps: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const {
    chain,
    targetAsset,
    sourceAsset,
    targetChain,
    amount,
    step,
  } = useSelector(selectBridgeWithdrawPage);
  const network = useMemo(
    () => BridgeNetworkDictionary.get(targetChain as Chain),
    [targetChain],
  );

  const currentAsset = useMemo(
    () =>
      BridgeDictionary.get(chain as Chain, targetChain as Chain)?.getAsset(
        sourceAsset as CrossBridgeAsset,
      ) as AssetModel,
    [chain, sourceAsset, targetChain],
  );

  const asset = useMemo(
    () =>
      BridgeDictionary.get(targetChain as Chain, chain as Chain)?.getAsset(
        targetAsset as CrossBridgeAsset,
      ) as AssetModel,
    [chain, targetAsset, targetChain],
  );

  const steps = useMemo<StepItem[]>(() => {
    const prvSteps = [...initialSteps.map(item => ({ ...item }))];
    if (step > WithdrawStep.CHAIN_SELECTOR && network) {
      prvSteps[WithdrawStep.CHAIN_SELECTOR].title = network?.name;
      prvSteps[WithdrawStep.CHAIN_SELECTOR].icon = (
        <img
          className={'tw-object-contain tw-h-full tw-w-full tw-rounded-full'}
          src={network?.logo}
          alt={network?.chain}
        />
      );
    }

    if (step > WithdrawStep.TOKEN_SELECTOR && asset) {
      prvSteps[WithdrawStep.TOKEN_SELECTOR].title = asset?.symbol;
      prvSteps[WithdrawStep.TOKEN_SELECTOR].icon = (
        <img
          className={'tw-object-contain tw-h-full tw-w-full tw-rounded-full'}
          src={asset?.image}
          alt={asset?.symbol}
        />
      );
    }
    const bnAmount = bignumber(amount || '0');
    if (
      currentAsset &&
      bnAmount.greaterThan(0) &&
      step > WithdrawStep.AMOUNT_SELECTOR
    ) {
      prvSteps[WithdrawStep.AMOUNT_SELECTOR].title = toNumberFormat(
        currentAsset.fromWei(amount),
        currentAsset.minDecimals,
      );
      prvSteps[WithdrawStep.AMOUNT_SELECTOR].icon = (
        <div className="tw-h-full tw-w-full tw-rounded-full tw-bg-sov-white tw-flex tw-items-center tw-justify-center">
          <img
            className={'tw-object-contain tw-h-3 tw-w-3'}
            src={walletIcon}
            alt="wallet"
          />
        </div>
      );
    }

    if (step === WithdrawStep.COMPLETE) {
      prvSteps[WithdrawStep.COMPLETE].icon = (
        <div className="tw-bg-gray-4 tw-object-contain tw-h-4.5 tw-w-4.5 tw-rounded-full">
          <img
            className={
              'tw-object-contain tw-h-full tw-w-full tw-rounded-full tw-bg-gray-4 tw-border tw-border-gray-4'
            }
            src={iconSuccess}
            title={t(translations.common.confirmed)}
            alt={t(translations.common.confirmed)}
          />
        </div>
      );
    }

    return prvSteps;
  }, [step, network, asset, currentAsset, amount, t]);

  const canOpen = useCallback(
    (testStep: WithdrawStep) => {
      const indexOfTest = stepOrder.indexOf(testStep);
      const indexOfStep = stepOrder.indexOf(step);

      if (indexOfTest === -1 || indexOfStep === -1) {
        return false;
      }
      return (
        indexOfTest < indexOfStep &&
        // Can't go back if in confirm, processing or complete state.
        ![
          WithdrawStep.CONFIRM,
          WithdrawStep.PROCESSING,
          WithdrawStep.COMPLETE,
        ].includes(step)
      );
    },
    [step],
  );

  const changeStep = useCallback(
    (nextStep: WithdrawStep) => {
      if (canOpen(nextStep)) {
        dispatch(actions.setStep(nextStep));
      }
    },
    [canOpen, dispatch],
  );

  const handleBack = useCallback(() => {
    if (step === WithdrawStep.CHAIN_SELECTOR) {
      return history.push('/wallet');
    } else {
      changeStep(stepOrder[step - 1]);
    }
  }, [changeStep, history, step]);

  return (
    <>
      {step < WithdrawStep.CONFIRM && (
        <div
          onClick={handleBack}
          className="tw-absolute tw-top-16 tw-left-0 tw-flex tw-items-center tw-font-semibold tw-text-2xl tw-cursor-pointer tw-select-none"
        >
          <img
            alt="arrowback"
            src={ArrowBack}
            style={{ height: '20px', width: '20px', marginRight: '10px' }}
          />
          {t(translations.common.back)}
        </div>
      )}
      <div className="tw-mt-24">
        <Stepper steps={steps} step={step} onClick={changeStep} />
      </div>
    </>
  );
};
