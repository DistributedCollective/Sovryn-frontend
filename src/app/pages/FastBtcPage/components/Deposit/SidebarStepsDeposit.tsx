import React, { useContext, useMemo, useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

import { prettyTx } from 'utils/helpers';

import addressIcon from 'assets/images/fast-btc/address-icon.svg';
import successIcon from 'assets/images/fast-btc/success-icon.svg';
import { DepositContext, DepositStep } from '../../contexts/deposit-context';
import { FastBtcDirectionType, NetworkAwareComponentProps } from '../../types';
import { TxStatus } from 'store/global/transactions-store/types';
import { Stepper, StepItem } from 'app/components/Stepper';

const stepOrder = [
  DepositStep.VALIDATION,
  DepositStep.ADDRESS,
  DepositStep.PROCESSING,
  DepositStep.COMPLETED,
];

const isBehindStep = (current: DepositStep, needed: DepositStep) =>
  stepOrder.indexOf(current) > stepOrder.indexOf(needed);

type SidebarStepsDepositProps = NetworkAwareComponentProps & {
  type: FastBtcDirectionType;
};

export const SidebarStepsDeposit: React.FC<SidebarStepsDepositProps> = ({
  type,
}) => {
  const { t } = useTranslation();
  const { step, set, address, depositTx } = useContext(DepositContext);

  const initialSteps: StepItem[] = useMemo(
    () => [
      {
        stepTitle: (
          <Trans
            i18nKey={translations.fastBtcPage.deposit.sidebarSteps.validation}
          />
        ),
        value: DepositStep.VALIDATION,
      },
      ...(type === FastBtcDirectionType.DEPOSIT
        ? [
            {
              stepTitle: (
                <Trans
                  i18nKey={
                    translations.fastBtcPage.deposit.sidebarSteps.address
                  }
                />
              ),
              value: DepositStep.ADDRESS,
            },
            {
              stepTitle: (
                <Trans
                  i18nKey={
                    translations.fastBtcPage.deposit.sidebarSteps.processing
                  }
                />
              ),
              value: DepositStep.PROCESSING,
            },
            {
              stepTitle: (
                <Trans
                  i18nKey={
                    translations.fastBtcPage.deposit.sidebarSteps.completed
                  }
                />
              ),
              value: DepositStep.COMPLETED,
            },
          ]
        : [
            {
              stepTitle: (
                <Trans
                  i18nKey={
                    translations.fastBtcPage.transak.sidebarSteps.address
                  }
                />
              ),
              value: DepositStep.ADDRESS,
            },
          ]),
    ],
    [type],
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
      const nextStepIndex = stepOrder.indexOf(testStep);
      const activeStepIndex = stepOrder.indexOf(step);

      if (nextStepIndex === -1 || activeStepIndex === -1) {
        return false;
      }
      return (
        nextStepIndex < activeStepIndex &&
        // Can't go back if in processing or complete state.
        ![DepositStep.PROCESSING, DepositStep.COMPLETED].includes(step)
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
      {step !== DepositStep.MAIN && (
        <div
          className="tw-w-full tw-my-10 tw-px-6"
          style={{ minWidth: '40rem' }}
        >
          <Stepper steps={steps} step={step} onClick={changeStep} />
        </div>
      )}
    </>
  );
};
