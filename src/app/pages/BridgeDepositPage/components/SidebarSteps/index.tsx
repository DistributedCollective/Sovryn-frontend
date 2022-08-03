import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../slice';
import { DepositStep } from '../../types';
import { selectBridgeDepositPage } from '../../selectors';

import { StepItem, Stepper } from 'app/components/Stepper';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { Trans } from 'react-i18next';
import { translations } from 'locales/i18n';

const stepOrder = [
  DepositStep.CHAIN_SELECTOR,
  DepositStep.WALLET_SELECTOR,
  DepositStep.TOKEN_SELECTOR,
  DepositStep.AMOUNT_SELECTOR,
  DepositStep.REVIEW,
  DepositStep.CONFIRM,
  DepositStep.PROCESSING,
  DepositStep.COMPLETE,
];

// User should be able to go back on steps but not forward (even if moved back,
// unless we are confident that user didn't change anything)
export const SidebarSteps: React.FC = () => {
  const { checkMaintenance, States } = useMaintenance();
  const bridgeLocked = checkMaintenance(States.BRIDGE);

  const dispatch = useDispatch();

  const { step: activeStep } = useSelector(selectBridgeDepositPage);

  const initialSteps: StepItem[] = useMemo(
    () => [
      {
        stepTitle: (
          <Trans
            i18nKey={translations.BridgeDepositPage.sidebarSteps.chooseSource}
          />
        ),
        value: DepositStep.CHAIN_SELECTOR,
      },
      {
        stepTitle: (
          <Trans
            i18nKey={translations.BridgeDepositPage.sidebarSteps.selectWallet}
          />
        ),
        value: DepositStep.WALLET_SELECTOR,
      },
      {
        stepTitle: (
          <Trans
            i18nKey={translations.BridgeDepositPage.sidebarSteps.selectToken}
          />
        ),
        value: DepositStep.TOKEN_SELECTOR,
      },
      {
        stepTitle: (
          <Trans
            i18nKey={translations.BridgeDepositPage.sidebarSteps.enterAmount}
          />
        ),
        value: DepositStep.AMOUNT_SELECTOR,
      },
      {
        stepTitle: (
          <Trans
            i18nKey={
              translations.BridgeDepositPage.sidebarSteps.reviewTransaction
            }
          />
        ),
        value: DepositStep.REVIEW,
      },
      {
        stepTitle: (
          <Trans
            i18nKey={
              translations.BridgeDepositPage.sidebarSteps.processingTransaction
            }
          />
        ),
        value: DepositStep.PROCESSING,
      },
      {
        stepTitle: (
          <Trans
            i18nKey={
              translations.BridgeDepositPage.sidebarSteps.transactionCompleted
            }
          />
        ),
        value: DepositStep.COMPLETE,
      },
    ],
    [],
  );

  const canOpen = useCallback(
    (nextStep: DepositStep) => {
      const nextStepIndex = stepOrder.indexOf(nextStep);
      const activeStepIndex = stepOrder.indexOf(activeStep);

      if (nextStepIndex === -1 || activeStepIndex === -1) {
        return false;
      }
      return (
        nextStepIndex < activeStepIndex &&
        // Can't go back if in processing or complete state.
        ![DepositStep.PROCESSING, DepositStep.COMPLETE].includes(activeStep)
      );
    },
    [activeStep],
  );

  const changeStep = useCallback(
    (nextStep: DepositStep) => {
      if (canOpen(nextStep)) {
        dispatch(actions.setStep(nextStep));
      }
    },
    [canOpen, dispatch],
  );

  const currentStep = useMemo<DepositStep>(() => {
    if (activeStep === DepositStep.CONFIRM) {
      return DepositStep.REVIEW;
    }

    return activeStep;
  }, [activeStep]);

  return (
    <div className="tw-w-full">
      <Stepper
        locked={bridgeLocked}
        steps={initialSteps}
        step={currentStep}
        onClick={changeStep}
      />
    </div>
  );
};
