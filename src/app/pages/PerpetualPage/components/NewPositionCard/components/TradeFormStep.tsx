import React, { useCallback, useContext } from 'react';
import { NewPositionCardContext } from '..';
import { TransitionStep } from '../../../../../containers/TransitionSteps';
import { TradeForm } from '../../TradeForm';
import { NewPositionCardStep } from '../types';

export const TradeFormStep: TransitionStep<NewPositionCardStep> = ({
  changeTo,
}) => {
  const { trade, onSubmit, onChangeTrade } = useContext(NewPositionCardContext);
  const onOpenSlippage = useCallback(
    () => changeTo(NewPositionCardStep.slippage),
    [changeTo],
  );
  return (
    <div className="tw-p-4">
      <TradeForm
        trade={trade}
        isNewTrade
        onOpenSlippage={onOpenSlippage}
        onSubmit={onSubmit}
        onChange={onChangeTrade}
      />
    </div>
  );
};
