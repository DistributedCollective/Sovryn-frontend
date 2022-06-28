import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../slice';
import { DepositStep } from '../../types';
import { selectBridgeDepositPage } from '../../selectors';

import { StepItem, Stepper } from 'app/components/Stepper';
import { useMaintenance } from 'app/hooks/useMaintenance';

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

const initialSteps: StepItem[] = [
  { stepTitle: 'Choose Source', value: DepositStep.CHAIN_SELECTOR },
  { stepTitle: 'Select Wallet', value: DepositStep.WALLET_SELECTOR },
  { stepTitle: 'Select Token', value: DepositStep.TOKEN_SELECTOR },
  { stepTitle: 'Enter Amount', value: DepositStep.AMOUNT_SELECTOR },
  { stepTitle: 'Review Transaction', value: DepositStep.REVIEW },
  { stepTitle: 'Processing Transaction', value: DepositStep.PROCESSING },
  { stepTitle: 'Transaction Completed', value: DepositStep.COMPLETE },
];

// User should be able to go back on steps but not forward (even if moved back,
// unless we are confident that user didn't change anything)
export const SidebarSteps: React.FC = () => {
  const { checkMaintenance, States } = useMaintenance();
  const bridgeLocked = checkMaintenance(States.BRIDGE);

  const dispatch = useDispatch();

  const { step } = useSelector(selectBridgeDepositPage);

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

  const activeStep = useMemo<DepositStep>(() => {
    if (step === DepositStep.CONFIRM) {
      return DepositStep.REVIEW;
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
