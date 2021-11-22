import React, { useContext, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { translations } from 'locales/i18n';
import {
  StepItem,
  Stepper,
} from 'app/pages/BridgeDepositPage/components/Stepper';
import ArrowBack from 'assets/images/genesis/arrow_back.svg';
import { prettyTx } from 'utils/helpers';

import addressIcon from '../../assets/address-icon.svg';
import successIcon from '../../assets/success-icon.svg';
import { DepositContext, DepositStep } from '../../contexts/deposit-context';

const stepOrder = [
  DepositStep.ADDRESS,
  DepositStep.PROCESSING,
  DepositStep.COMPLETED,
];

const initialSteps: StepItem[] = [
  { stepTitle: 'Deposit Address', value: DepositStep.ADDRESS },
  { stepTitle: 'Processing', value: DepositStep.PROCESSING },
  { stepTitle: 'Complete', value: DepositStep.COMPLETED },
];

export const SidebarStepsDeposit: React.FC = () => {
  const { t } = useTranslation();
  const { step, set, address, depositTx } = useContext(DepositContext);

  const steps = useMemo<StepItem[]>(() => {
    const previousSteps = [...initialSteps.map(item => ({ ...item }))];

    if (step > DepositStep.ADDRESS && address) {
      const item = previousSteps.find(
        item => item.value === DepositStep.ADDRESS,
      );
      if (item) {
        item.title = prettyTx(address);
        item.icon = (
          <img
            className="tw-object-contain tw-h-full tw-w-full tw-rounded-full"
            src={addressIcon}
            alt={address}
          />
        );
      }
    }

    if (step === DepositStep.PROCESSING) {
      const item = previousSteps.find(
        item => item.value === DepositStep.PROCESSING,
      );
      if (item) {
        if (depositTx?.status === 'pending') {
          item.title = 'Processing (1/2)';
        }
        if (depositTx?.status === 'confirmed') {
          item.title = 'Processing (2/2)';
        }
      }
    }

    if (step === DepositStep.COMPLETED) {
      const item = previousSteps.find(
        item => item.value === DepositStep.COMPLETED,
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
  }, [step, address, depositTx]);

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
        ![DepositStep.CONFIRM, DepositStep.COMPLETED].includes(step)
      );
    },
    [step],
  );

  const changeStep = useCallback(
    (nextStep: DepositStep) => {
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
      {step !== DepositStep.MAIN && (
        <div className="tw-mt-24">
          <Stepper steps={steps} step={step} onClick={changeStep} />
        </div>
      )}
    </>
  );
};
