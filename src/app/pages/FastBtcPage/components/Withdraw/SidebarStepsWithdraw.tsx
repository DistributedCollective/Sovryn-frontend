import React, { useContext, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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
import { Link } from 'react-router-dom';

const stepOrder = [
  WithdrawStep.MAIN,
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

// User should be able to go back on steps but not forward (even if moved back,
// unless we are confident that user didn't change anything)

type SidebarStepsProps = {};

export const SidebarStepsWithdraw: React.FC<SidebarStepsProps> = () => {
  const { t } = useTranslation();
  const { step, set, amount, address } = useContext(WithdrawContext);

  const steps = useMemo<StepItem[]>(() => {
    const prvSteps = [...initialSteps.map(item => ({ ...item }))];
    if (step > WithdrawStep.AMOUNT && amount) {
      prvSteps[WithdrawStep.AMOUNT].title = (
        <>
          {toNumberFormat(amount, 8)} <AssetSymbolRenderer asset={Asset.RBTC} />
        </>
      );
      // prvSteps[WithdrawStep.AMOUNT].icon = (
      //   <img
      //     className={'tw-object-contain tw-h-full tw-w-full tw-rounded-full'}
      //     src={amount}
      //     alt={amount}
      //   />
      // );
    }

    if (step > WithdrawStep.ADDRESS && address) {
      prvSteps[WithdrawStep.ADDRESS].title = prettyTx(address);
      // prvSteps[WithdrawStep.ADDRESS].icon = (
      //   <img
      //     className={'tw-object-contain tw-h-full tw-w-full tw-rounded-full'}
      //     src={address}
      //     alt={address}
      //   />
      // );
    }

    if (step >= WithdrawStep.PROCESSING) {
      prvSteps[WithdrawStep.PROCESSING].title = 'Processing...';
    }

    return prvSteps;
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
        className="tw-absolute tw-top-0 tw-left-0 tw-flex tw-items-center tw-font-semibold tw-text-2xl tw-cursor-pointer tw-select-none tw-text-white tw-whitespace-nowrap tw-no-underline"
      >
        <img
          alt="arrowback"
          src={ArrowBack}
          style={{ height: '20px', width: '20px', marginRight: '10px' }}
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
