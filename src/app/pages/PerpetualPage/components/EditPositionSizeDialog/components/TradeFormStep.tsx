import React, { useCallback, useMemo, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TransitionStep } from '../../../../../containers/TransitionSteps';
import { selectPerpetualPage } from '../../../selectors';
import { actions } from '../../../slice';
import {
  isPerpetualTrade,
  PerpetualPageModals,
  PerpetualTrade,
} from '../../../types';
import { TradeForm } from '../../TradeForm';
import { EditPositionSizeDialogStep } from '../types';
import { EditPositionSizeDialogContext } from '..';

export const TradeFormStep: TransitionStep<EditPositionSizeDialogStep> = ({
  changeTo,
}) => {
  const dispatch = useDispatch();
  const { changedTrade, onChange } = useContext(EditPositionSizeDialogContext);

  const onOpenSlippage = useCallback(
    () => changeTo(EditPositionSizeDialogStep.slippage),
    [changeTo],
  );

  const onSubmit = useCallback(
    () =>
      dispatch(
        actions.setModal(PerpetualPageModals.TRADE_REVIEW, changedTrade),
      ),
    [dispatch, changedTrade],
  );

  if (!changedTrade) {
    return null;
  }

  return (
    <TradeForm
      trade={changedTrade}
      onOpenSlippage={onOpenSlippage}
      onSubmit={onSubmit}
      onChange={onChange}
    />
  );
};
