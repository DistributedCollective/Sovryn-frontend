import React, { useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { TransitionStep } from '../../../../../containers/TransitionSteps';
import { actions } from '../../../slice';
import { PerpetualPageModals } from '../../../types';
import { TradeForm } from '../../TradeForm';
import { EditPositionSizeDialogStep } from '../types';
import { EditPositionSizeDialogContext } from '..';
import { getTradeDirection } from '../../../utils/contractUtils';
import { fromWei, toWei } from 'web3-utils';
import { TradingPosition } from '../../../../../../types/trading-position';
import { usePerpetual_queryTraderState } from '../../../hooks/usePerpetual_queryTraderState';

export const TradeFormStep: TransitionStep<EditPositionSizeDialogStep> = ({
  changeTo,
}) => {
  const dispatch = useDispatch();
  const traderState = usePerpetual_queryTraderState();
  const { trade, changedTrade, onChange } = useContext(
    EditPositionSizeDialogContext,
  );

  const onOpenSlippage = useCallback(
    () => changeTo(EditPositionSizeDialogStep.slippage),
    [changeTo],
  );

  const onSubmit = useCallback(() => {
    if (!trade || !changedTrade) {
      return;
    }

    const amountCurrent =
      getTradeDirection(trade?.position) * Number(fromWei(trade?.amount));
    const amountChange =
      getTradeDirection(changedTrade?.position) *
      Number(fromWei(changedTrade?.amount));

    const amountTarget = amountCurrent + amountChange;

    const targetTrade = {
      ...changedTrade,
      amount: toWei(Math.abs(amountTarget).toPrecision(8)),
      position:
        amountTarget >= 0 ? TradingPosition.LONG : TradingPosition.SHORT,
      margin: toWei(traderState.availableCashCC.toPrecision(8)),
    };

    dispatch(
      actions.setModal(PerpetualPageModals.TRADE_REVIEW, {
        origin: PerpetualPageModals.EDIT_POSITION_SIZE,
        trade: targetTrade,
        transactions: [
          {
            method: 'trade',
            amount: changedTrade.amount,
            tradingPosition: changedTrade.position,
            slippage: changedTrade.slippage,
            tx: null,
          },
        ],
      }),
    );
  }, [dispatch, trade, changedTrade, traderState]);

  if (!changedTrade) {
    return null;
  }

  return (
    <div className="tw-mw-340 tw-h-full tw-mx-auto">
      <TradeForm
        trade={changedTrade}
        onOpenSlippage={onOpenSlippage}
        onSubmit={onSubmit}
        onChange={onChange}
      />
    </div>
  );
};
