import React, { useContext, useMemo, useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Asset } from 'types';
import { Stepper, StepItem } from 'app/components/Stepper';
import { WithdrawContext, WithdrawStep } from '../../contexts/withdraw-context';
import { toNumberFormat } from 'utils/display-text/format';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { prettyTx } from 'utils/helpers';

import walletIcon from 'assets/images/fast-btc/wallet-icon.svg';
import addressIcon from 'assets/images/fast-btc/address-icon.svg';
import successIcon from 'assets/images/fast-btc/success-icon.svg';
import { NetworkAwareComponentProps } from '../../types';

const stepOrder = [
  WithdrawStep.AMOUNT,
  WithdrawStep.ADDRESS,
  WithdrawStep.REVIEW,
  WithdrawStep.CONFIRM,
  WithdrawStep.PROCESSING,
  WithdrawStep.COMPLETED,
];

const isBehindStep = (current: WithdrawStep, needed: WithdrawStep) =>
  stepOrder.indexOf(current) > stepOrder.indexOf(needed);

export const SidebarStepsWithdraw: React.FC<NetworkAwareComponentProps> = () => {
  const { t } = useTranslation();
  const { step, set, amount, address } = useContext(WithdrawContext);

  const initialSteps: StepItem[] = useMemo(
    () => [
      {
        stepTitle: (
          <Trans
            i18nKey={translations.fastBtcPage.withdraw.sidebarSteps.amount}
          />
        ),
        value: WithdrawStep.AMOUNT,
      },
      {
        stepTitle: (
          <Trans
            i18nKey={translations.fastBtcPage.withdraw.sidebarSteps.address}
          />
        ),
        value: WithdrawStep.ADDRESS,
      },
      {
        stepTitle: (
          <Trans
            i18nKey={translations.fastBtcPage.withdraw.sidebarSteps.review}
          />
        ),
        value: WithdrawStep.REVIEW,
      },
      {
        stepTitle: (
          <Trans
            i18nKey={translations.fastBtcPage.withdraw.sidebarSteps.processing}
          />
        ),
        value: WithdrawStep.PROCESSING,
      },
      {
        stepTitle: (
          <Trans
            i18nKey={translations.fastBtcPage.withdraw.sidebarSteps.completed}
          />
        ),
        value: WithdrawStep.COMPLETED,
      },
    ],
    [],
  );

  const steps = useMemo<StepItem[]>(() => {
    const previousSteps = [...initialSteps.map(item => ({ ...item }))];
    if (isBehindStep(step, WithdrawStep.AMOUNT) && amount) {
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

    if (isBehindStep(step, WithdrawStep.ADDRESS) && address) {
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
        item.title = t(
          translations.fastBtcPage.withdraw.sidebarSteps.processingProgress,
        );
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
  }, [step, address, amount, t, initialSteps]);

  const canOpen = useCallback(
    (testStep: WithdrawStep) => {
      const nextStepIndex = stepOrder.indexOf(testStep);
      const activeStepIndex = stepOrder.indexOf(step);

      if (nextStepIndex === -1 || activeStepIndex === -1) {
        return false;
      }
      return (
        nextStepIndex < activeStepIndex &&
        // Can't go back if in processing or complete state.
        ![WithdrawStep.PROCESSING, WithdrawStep.COMPLETED].includes(step)
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

  const activeStep = useMemo(() => {
    if (step === WithdrawStep.CONFIRM) return WithdrawStep.REVIEW;
    return step;
  }, [step]);

  return (
    <>
      {step !== WithdrawStep.MAIN && (
        <div
          className="tw-my-10 tw-px-6"
          style={{
            width: 680,
            maxWidth: 'calc(100vw - 22rem)',
          }}
        >
          <Stepper steps={steps} step={activeStep} onClick={changeStep} />
        </div>
      )}
    </>
  );
};
