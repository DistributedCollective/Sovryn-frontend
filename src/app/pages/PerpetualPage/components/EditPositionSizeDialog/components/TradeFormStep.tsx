import React, { useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { TransitionStep } from '../../../../../containers/TransitionSteps';
import { actions } from '../../../slice';
import { PerpetualPageModals } from '../../../types';
import { TradeForm } from '../../TradeForm';
import { EditPositionSizeDialogStep } from '../types';
import { EditPositionSizeDialogContext } from '..';
import { getSignedAmount } from '../../../utils/contractUtils';
import { TradingPosition } from '../../../../../../types/trading-position';
import { PerpetualTxMethods } from '../../TradeDialog/types';
import { PerpetualQueriesContext } from 'app/pages/PerpetualPage/contexts/PerpetualQueriesContext';
import { toWei } from '../../../../../../utils/blockchain/math-helpers';
import { usePerpetual_getCurrentPairId } from 'app/pages/PerpetualPage/hooks/usePerpetual_getCurrentPairId';

export const TradeFormStep: TransitionStep<EditPositionSizeDialogStep> = ({
  changeTo,
}) => {
  const dispatch = useDispatch();

  const currentPairId = usePerpetual_getCurrentPairId();
  const { perpetuals } = useContext(PerpetualQueriesContext);
  const { traderState } = perpetuals[currentPairId];

  const { pairType, trade, changedTrade, onChange } = useContext(
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

    const amountCurrent = getSignedAmount(trade.position, trade.amount);
    const amountChange = getSignedAmount(
      changedTrade.position,
      changedTrade.amount,
    );

    const amountTarget = amountCurrent + amountChange;

    const targetTrade = {
      ...changedTrade,
      amount: toWei(Math.abs(amountTarget)),
      position:
        amountTarget >= 0 ? TradingPosition.LONG : TradingPosition.SHORT,
      margin: toWei(traderState.availableCashCC),
    };

    dispatch(
      actions.setModal(PerpetualPageModals.TRADE_REVIEW, {
        origin: PerpetualPageModals.EDIT_POSITION_SIZE,
        trade: targetTrade,
        transactions: [
          {
            pair: pairType,
            method: PerpetualTxMethods.trade,
            amount: changedTrade.amount,
            tradingPosition: changedTrade.position,
            slippage: changedTrade.slippage,
            tx: null,
            approvalTx: null,
            origin: PerpetualPageModals.EDIT_POSITION_SIZE,
          },
        ],
      }),
    );
  }, [dispatch, pairType, trade, changedTrade, traderState]);

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
