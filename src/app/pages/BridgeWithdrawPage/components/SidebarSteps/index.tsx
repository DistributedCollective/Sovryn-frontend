import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../slice';
import { WithdrawStep } from '../../types';
import { selectBridgeWithdrawPage } from '../../selectors';
import { StepItem, Stepper } from 'app/components/Stepper';

import { useMaintenance } from 'app/hooks/useMaintenance';
import { Trans } from 'react-i18next';
import { translations } from 'locales/i18n';

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

// User should be able to go back on steps but not forward (even if moved back,
// unless we are confident that user didn't change anything)
export const SidebarSteps: React.FC = () => {
  const dispatch = useDispatch();
  const { checkMaintenance, States } = useMaintenance();
  const bridgeLocked = checkMaintenance(States.BRIDGE);

  const { step } = useSelector(selectBridgeWithdrawPage);

  const initialSteps: StepItem[] = useMemo(
    () => [
      {
        stepTitle: (
          <Trans
            i18nKey={
              translations.BridgeWithdrawPage.sidebarSteps.chooseDestination
            }
          />
        ),
        value: WithdrawStep.CHAIN_SELECTOR,
      },
      {
        stepTitle: (
          <Trans
            i18nKey={translations.BridgeWithdrawPage.sidebarSteps.selectToken}
          />
        ),
        value: WithdrawStep.TOKEN_SELECTOR,
      },
      {
        stepTitle: (
          <Trans
            i18nKey={translations.BridgeWithdrawPage.sidebarSteps.enterAmount}
          />
        ),
        value: WithdrawStep.AMOUNT_SELECTOR,
      },
      {
        stepTitle: (
          <Trans
            i18nKey={translations.BridgeWithdrawPage.sidebarSteps.enterAddress}
          />
        ),
        value: WithdrawStep.RECEIVER_SELECTOR,
      },
      {
        stepTitle: (
          <Trans
            i18nKey={
              translations.BridgeWithdrawPage.sidebarSteps.reviewTransaction
            }
          />
        ),
        value: WithdrawStep.REVIEW,
      },
      {
        stepTitle: (
          <Trans
            i18nKey={
              translations.BridgeWithdrawPage.sidebarSteps.processingTransaction
            }
          />
        ),
        value: WithdrawStep.PROCESSING,
      },
      {
        stepTitle: (
          <Trans
            i18nKey={
              translations.BridgeWithdrawPage.sidebarSteps.transactionCompleted
            }
          />
        ),
        value: WithdrawStep.COMPLETE,
      },
    ],
    [],
  );

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
        ![WithdrawStep.PROCESSING, WithdrawStep.COMPLETE].includes(step)
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

  const activeStep = useMemo<WithdrawStep>(() => {
    if (step === WithdrawStep.CONFIRM) {
      return WithdrawStep.REVIEW;
    }

    return step;
  }, [step]);

  return (
    <div className="tw-w-full">
      <Stepper
        locked={bridgeLocked}
        steps={initialSteps}
        step={activeStep}
        onClick={changeStep}
      />
    </div>
  );
};
