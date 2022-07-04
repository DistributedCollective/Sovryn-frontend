import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../slice';
import { WithdrawStep } from '../../types';
import { selectBridgeWithdrawPage } from '../../selectors';
import { StepItem, Stepper } from 'app/components/Stepper';

import { useMaintenance } from 'app/hooks/useMaintenance';

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

const initialSteps: StepItem[] = [
  {
    stepTitle: (
      <>
        Choose <br />
        Destination
      </>
    ),
    value: WithdrawStep.CHAIN_SELECTOR,
  },
  {
    stepTitle: (
      <>
        Select
        <br /> Token
      </>
    ),
    value: WithdrawStep.TOKEN_SELECTOR,
  },
  {
    stepTitle: (
      <>
        Enter
        <br /> Amount
      </>
    ),
    value: WithdrawStep.AMOUNT_SELECTOR,
  },
  {
    stepTitle: (
      <>
        Enter
        <br /> Address
      </>
    ),
    value: WithdrawStep.RECEIVER_SELECTOR,
  },
  {
    stepTitle: (
      <>
        Review
        <br /> Transaction
      </>
    ),
    value: WithdrawStep.REVIEW,
  },
  {
    stepTitle: (
      <>
        Processing
        <br /> Transaction
      </>
    ),
    value: WithdrawStep.PROCESSING,
  },
  {
    stepTitle: (
      <>
        Transaction
        <br /> Completed
      </>
    ),
    value: WithdrawStep.COMPLETE,
  },
];

// User should be able to go back on steps but not forward (even if moved back,
// unless we are confident that user didn't change anything)
export const SidebarSteps: React.FC = () => {
  const dispatch = useDispatch();
  const { checkMaintenance, States } = useMaintenance();
  const bridgeLocked = checkMaintenance(States.BRIDGE);

  const { step } = useSelector(selectBridgeWithdrawPage);

  const canOpen = useCallback(
    (testStep: WithdrawStep) => {
      const indexOfTest = stepOrder.indexOf(testStep);
      const indexOfStep = stepOrder.indexOf(step);

      if (indexOfTest === -1 || indexOfStep === -1) {
        return false;
      }
      return (
        indexOfTest < indexOfStep &&
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
