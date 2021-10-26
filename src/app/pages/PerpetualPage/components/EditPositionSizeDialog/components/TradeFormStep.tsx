import React, { useCallback, useMemo } from 'react';
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

export const TradeFormStep: TransitionStep<EditPositionSizeDialogStep> = ({
  changeTo,
}) => {
  const dispatch = useDispatch();

  const onOpenSlippage = useCallback(
    () => changeTo(EditPositionSizeDialogStep.slippage),
    [changeTo],
  );

  const { modalOptions } = useSelector(selectPerpetualPage);
  const trade = useMemo(
    () => (isPerpetualTrade(modalOptions) ? modalOptions : undefined),
    [modalOptions],
  );

  console.log(modalOptions, trade);

  const onChange = useCallback(
    (trade: PerpetualTrade) =>
      dispatch(actions.setModal(PerpetualPageModals.EDIT_POSITION_SIZE, trade)),
    [dispatch],
  );

  const onSubmit = useCallback(
    () => dispatch(actions.setModal(PerpetualPageModals.TRADE_REVIEW, trade)),
    [dispatch, trade],
  );

  if (!trade) {
    return null;
  }

  return (
    <TradeForm
      trade={trade}
      onOpenSlippage={onOpenSlippage}
      onSubmit={onSubmit}
      onChange={onChange}
    />
  );
};
