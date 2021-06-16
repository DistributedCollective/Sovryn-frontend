import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../slice';
import { DepositStep } from '../../types';
import { selectBridgeDepositPage } from '../../selectors';

const stepOrder = [
  DepositStep.CHAIN_SELECTOR,
  DepositStep.TOKEN_SELECTOR,
  DepositStep.AMOUNT_SELECTOR,
  DepositStep.REVIEW,
  DepositStep.CONFIRM,
  DepositStep.PROCESSING,
  DepositStep.COMPLETE,
];

// User should be able to go back on steps but not forward (even if moved back,
// unless we are confident that user didn't change anything)
export function SidebarSteps() {
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

  return (
    <ul>
      <li>
        <button onClick={() => changeStep(DepositStep.CHAIN_SELECTOR)}>
          Network
        </button>
      </li>
      <li>
        <button onClick={() => changeStep(DepositStep.TOKEN_SELECTOR)}>
          Token
        </button>
      </li>
      <li>
        <button onClick={() => changeStep(DepositStep.AMOUNT_SELECTOR)}>
          Amount
        </button>
      </li>
      <li>
        <button onClick={() => changeStep(DepositStep.REVIEW)}>Review</button>
      </li>
      <li>
        <button>Confirm</button>
      </li>
      <li>
        <button>Processing</button>
      </li>
      <li>
        <button>Complete</button>
      </li>
    </ul>
  );
}
