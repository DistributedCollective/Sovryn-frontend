import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { actions } from '../../slice';
import { DepositStep } from '../../types';
import { selectBridgeDepositPage } from '../../selectors';
import { StepItem, Stepper } from '../Stepper';
import { BridgeNetworkDictionary } from '../../dictionaries/bridge-network-dictionary';
import { Chain } from 'types';
import { BridgeDictionary } from '../../dictionaries/bridge-dictionary';
import { CrossBridgeAsset } from '../../types/cross-bridge-asset';
import { AssetModel } from '../../types/asset-model';
import { toNumberFormat } from 'utils/display-text/format';
import { bignumber } from 'mathjs';
import walletIcon from 'assets/images/wallet-icon.svg';
import ArrowBack from 'assets/images/genesis/arrow_back.svg';

const stepOrder = [
  DepositStep.CHAIN_SELECTOR,
  DepositStep.TOKEN_SELECTOR,
  DepositStep.AMOUNT_SELECTOR,
  DepositStep.REVIEW,
  DepositStep.CONFIRM,
  DepositStep.PROCESSING,
  DepositStep.COMPLETE,
];

const initialSteps: StepItem[] = [
  { stepTitle: 'Network', value: DepositStep.CHAIN_SELECTOR },
  { stepTitle: 'Token', value: DepositStep.TOKEN_SELECTOR },
  { stepTitle: 'Amount', value: DepositStep.AMOUNT_SELECTOR },
  { stepTitle: 'Review', value: DepositStep.REVIEW },
  { stepTitle: 'Confirm', value: DepositStep.CONFIRM },
  { stepTitle: 'Processing', value: DepositStep.PROCESSING },
  { stepTitle: 'Complete', value: DepositStep.COMPLETE },
];

// User should be able to go back on steps but not forward (even if moved back,
// unless we are confident that user didn't change anything)
export function SidebarSteps() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { chain, sourceAsset, targetChain, amount, step } = useSelector(
    selectBridgeDepositPage,
  );
  const network = useMemo(() => BridgeNetworkDictionary.get(chain as Chain), [
    chain,
  ]);

  const asset = useMemo(
    () =>
      BridgeDictionary.get(chain as Chain, targetChain)?.getAsset(
        sourceAsset as CrossBridgeAsset,
      ) as AssetModel,
    [chain, sourceAsset, targetChain],
  );

  const steps = useMemo<StepItem[]>(() => {
    const prvSteps = [...initialSteps.map(item => ({ ...item }))];
    if (step > DepositStep.CHAIN_SELECTOR && network) {
      prvSteps[0].title = network?.name;
      prvSteps[0].icon = (
        <img
          className={'tw-object-contain tw-h-full tw-w-full tw-rounded-full'}
          src={network?.logo}
          alt={network?.chain}
        />
      );
    }

    if (step > DepositStep.TOKEN_SELECTOR && asset) {
      prvSteps[1].title = asset?.symbol;
      prvSteps[1].icon = (
        <img
          className={'tw-object-contain tw-h-full tw-w-full tw-rounded-full'}
          src={asset?.image}
          alt={asset?.symbol}
        />
      );
    }
    const bnAmount = bignumber(amount || '0');
    if (
      asset &&
      bnAmount.greaterThan(0) &&
      step > DepositStep.AMOUNT_SELECTOR
    ) {
      prvSteps[2].title = toNumberFormat(
        asset.fromWei(amount),
        asset.minDecimals,
      );
      prvSteps[2].icon = (
        <img
          className={'tw-object-contain tw-h-3 tw-w-3'}
          src={walletIcon}
          alt="wallet"
        />
      );
    }

    return prvSteps;
  }, [step, network, asset, amount]);

  const canOpen = useCallback(
    (testStep: DepositStep) => {
      const indexOfTest = stepOrder.indexOf(testStep);
      const indexOfStep = stepOrder.indexOf(step);

      if (indexOfTest === -1 || indexOfStep === -1) {
        return false;
      }
      return (
        indexOfTest < indexOfStep &&
        // Can't go back if in confirm, processing or complete state.
        ![
          DepositStep.CONFIRM,
          DepositStep.PROCESSING,
          DepositStep.COMPLETE,
        ].includes(step)
      );
    },
    [step],
  );

  const changeStep = useCallback(
    (nextStep: DepositStep) => {
      if (canOpen(nextStep)) {
        dispatch(actions.setStep(nextStep));
      }
    },
    [canOpen, dispatch],
  );

  const handleBack = useCallback(() => {
    if (step === DepositStep.CHAIN_SELECTOR) {
      return history.push('/wallet');
    } else {
      changeStep(stepOrder[step - 1]);
    }
  }, [changeStep, history, step]);

  return (
    <>
      {step < DepositStep.PROCESSING && (
        <div
          onClick={handleBack}
          className="tw-absolute tw-top-0 tw-left-0 tw-flex tw-items-center tw-font-semibold tw-text-xl tw-cursor-pointer tw-select-none"
        >
          <img
            alt="arrowback"
            src={ArrowBack}
            style={{ height: '20px', width: '20px', marginRight: '10px' }}
          />
          Back
        </div>
      )}
      <Stepper steps={steps} step={step} onClick={changeStep} />
    </>
  );
}
