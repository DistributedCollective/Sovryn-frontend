import React, { useContext, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { translations } from 'locales/i18n';
import { Asset } from 'types';
import {
  StepItem,
  Stepper,
} from 'app/pages/BridgeDepositPage/components/Stepper';
import { WithdrawContext, WithdrawStep } from '../../contexts/withdraw-context';
import { toNumberFormat } from 'utils/display-text/format';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import ArrowBack from 'assets/images/genesis/arrow_back.svg';
import { prettyTx } from 'utils/helpers';

import walletIcon from '../../assets/wallet-icon.svg';
import addressIcon from '../../assets/address-icon.svg';
import successIcon from '../../assets/success-icon.svg';

const stepOrder = [
  WithdrawStep.AMOUNT,
  WithdrawStep.ADDRESS,
  WithdrawStep.REVIEW,
  WithdrawStep.CONFIRM,
  WithdrawStep.PROCESSING,
  WithdrawStep.COMPLETED,
];

const initialSteps: StepItem[] = [
  { stepTitle: 'Withdraw Amount', value: WithdrawStep.AMOUNT },
  { stepTitle: 'Withdraw Address', value: WithdrawStep.ADDRESS },
  { stepTitle: 'Review', value: WithdrawStep.REVIEW },
  { stepTitle: 'Confirm', value: WithdrawStep.CONFIRM },
  { stepTitle: 'Processing', value: WithdrawStep.PROCESSING },
  { stepTitle: 'Complete', value: WithdrawStep.COMPLETED },
];

export const SidebarStepsWithdraw: React.FC = () => {
  const { t } = useTranslation();
  const { step, set, amount, address } = useContext(WithdrawContext);

  const steps = useMemo<StepItem[]>(() => {
    const previousSteps = [...initialSteps.map(item => ({ ...item }))];
    if (step > WithdrawStep.AMOUNT && amount) {
      const item = previousSteps.find(
        item => item.value === WithdrawStep.AMOUNT,
      );
      if (item) {
        item.title = (
          <>
            {toNumberFormat(amount, 8)}{' '}
            <AssetSymbolRenderer asset={Asset.RBTC} />
          </>
        );
        item.icon = (
          <img
            className="tw-object-contain tw-h-full tw-w-full tw-rounded-full"
            src={walletIcon}
            alt={amount}
          />
        );
      }
    }

    if (step > WithdrawStep.ADDRESS && address) {
      const item = previousSteps.find(
        item => item.value === WithdrawStep.ADDRESS,
      );
      if (item) {
        item.title = prettyTx(address);
        item.icon = (
          <img
            className={'tw-object-contain tw-h-full tw-w-full tw-rounded-full'}
            src={addressIcon}
            alt={address}
          />
        );
      }
    }

    if (step === WithdrawStep.PROCESSING) {
      const item = previousSteps.find(
        item => item.value === WithdrawStep.PROCESSING,
      );
      if (item) {
        item.title = 'Processing...';
      }
    }

    if (step === WithdrawStep.COMPLETED) {
      const item = previousSteps.find(
        item => item.value === WithdrawStep.COMPLETED,
      );
      if (item) {
        item.icon = (
          <img
            className={'tw-object-contain tw-h-full tw-w-full tw-rounded-full'}
            src={successIcon}
            alt="Completed"
          />
        );
      }
    }

    return previousSteps;
  }, [step, address, amount]);

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
          WithdrawStep.COMPLETED,
        ].includes(step)
      );
    },
    [step],
  );

  const changeStep = useCallback(
    (nextStep: WithdrawStep) => {
      if (canOpen(nextStep)) {
        set(prevState => ({ ...prevState, step: nextStep }));
      }
    },
    [canOpen, set],
  );

  return (
    <>
      <Link
        to="/wallet"
        className="tw-absolute tw--top-2 tw-left-0 tw-flex tw-items-center tw-font-semibold tw-text-2xl tw-cursor-pointer tw-select-none tw-text-white tw-whitespace-nowrap tw-no-underline"
      >
        <img
          alt="arrowback"
          src={ArrowBack}
          className="tw-w-4 tw-h-4 tw-mr-2"
        />
        {t(translations.fastBtcPage.backToPortfolio)}
      </Link>
      {step !== WithdrawStep.MAIN && (
        <div className="tw-mt-24">
          <Stepper steps={steps} step={step} onClick={changeStep} />
        </div>
      )}
    </>
  );
};
