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

import addressIcon from 'assets/images/fast-btc/address-icon.svg';
import successIcon from 'assets/images/fast-btc/success-icon.svg';
import { DepositContext, DepositStep } from '../../contexts/deposit-context';
import { TxStatus } from 'store/global/transactions-store/types';

const stepOrder = [
  DepositStep.VALIDATION,
  DepositStep.ADDRESS,
  DepositStep.PROCESSING,
  DepositStep.COMPLETED,
];

const isBehindStep = (current: DepositStep, needed: DepositStep) =>
  stepOrder.indexOf(current) > stepOrder.indexOf(needed);

export const SidebarStepsDeposit: React.FC = () => {
  const { t } = useTranslation();
  const { step, set, address, depositTx } = useContext(DepositContext);

  const initialSteps: StepItem[] = useMemo(
    () => [
      {
        stepTitle: t(translations.fastBtcPage.deposit.sidebarSteps.validation),
        value: DepositStep.VALIDATION,
      },
      {
        stepTitle: t(translations.fastBtcPage.deposit.sidebarSteps.address),
        value: DepositStep.ADDRESS,
      },
      {
        stepTitle: t(translations.fastBtcPage.deposit.sidebarSteps.processing),
        value: DepositStep.PROCESSING,
      },
      {
        stepTitle: t(translations.fastBtcPage.deposit.sidebarSteps.completed),
        value: DepositStep.COMPLETED,
      },
    ],
    [t],
  );

  const steps = useMemo<StepItem[]>(() => {
    const previousSteps = [...initialSteps.map(item => ({ ...item }))];

    if (isBehindStep(step, DepositStep.ADDRESS) && address) {
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
        if (depositTx?.status === TxStatus.PENDING) {
          item.title = t(
            translations.fastBtcPage.deposit.sidebarSteps.processingSteps,
            {
              step: 1,
              steps: 2,
            },
          );
        }
        if (depositTx?.status === TxStatus.CONFIRMED) {
          item.title = t(
            translations.fastBtcPage.deposit.sidebarSteps.processingSteps,
            {
              step: 2,
              steps: 2,
            },
          );
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
  }, [step, address, depositTx, t, initialSteps]);

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
