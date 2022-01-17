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
import { NetworkAwareComponentProps } from '../../types';
import { Chain } from 'types';

const stepOrder = [
  DepositStep.ADDRESS,
  DepositStep.PROCESSING,
  DepositStep.COMPLETED,
];

export const SidebarStepsDeposit: React.FC<NetworkAwareComponentProps> = ({
  network,
}) => {
  const { t } = useTranslation();
  const { step, set, address, depositTx } = useContext(DepositContext);

  const initialSteps: StepItem[] = useMemo(
    () => [
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
          item.title = t(
            translations.fastBtcPage.deposit.sidebarSteps.processingSteps,
            {
              step: 1,
              steps: 2,
            },
          );
        }
        if (depositTx?.status === 'confirmed') {
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

  const backToUrl = useMemo(
    () => (network === Chain.BSC ? '/perpetual' : '/wallet'),
    [network],
  );

  const backToTitle = useMemo(
    () =>
      network === Chain.BSC
        ? t(translations.fastBtcPage.backToPerpetuals)
        : t(translations.fastBtcPage.backToPortfolio),
    [network, t],
  );

  return (
    <>
      <Link
        to={backToUrl}
        className="tw-absolute tw--top-2 tw-left-0 tw-flex tw-items-center tw-font-semibold tw-text-2xl tw-cursor-pointer tw-select-none tw-text-white tw-whitespace-nowrap tw-no-underline"
      >
        <img
          alt="arrowback"
          src={ArrowBack}
          className="tw-w-4 tw-h-4 tw-mr-2"
        />
        {backToTitle}
      </Link>
      {step !== DepositStep.MAIN && (
        <div className="tw-mt-24">
          <Stepper steps={steps} step={step} onClick={changeStep} />
        </div>
      )}
    </>
  );
};
