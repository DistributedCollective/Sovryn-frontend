import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from '../../../../containers/Dialog';
import { selectPerpetualPage } from '../../selectors';
import { actions } from '../../slice';
import {
  PerpetualPageModals,
  isPerpetualTradeReview,
  PerpetualTx,
} from '../../types';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from 'utils/dictionaries/perpetual-pair-dictionary';
import {
  TradeDialogContextType,
  TradeDialogStep,
  TradeDialogCurrentTransaction,
} from './types';
import { noop } from '../../../../constants';
import { TransitionSteps } from '../../../../containers/TransitionSteps';
import { TransitionAnimation } from '../../../../containers/TransitionContainer';
import { ReviewStep } from './components/ReviewStep';
import { ApprovalStep } from './components/ApprovalStep';
import { ConfirmationStep } from './components/ConfirmationStep';
import { TransactionStep } from './components/TransactionStep';
import { usePerpetual_analyseTrade } from '../../hooks/usePerpetual_analyseTrade';

const tradeDialogContextDefault: TradeDialogContextType = {
  pair: PerpetualPairDictionary.get(PerpetualPairType.BTCUSD),
  analysis: {
    amountChange: 0,
    amountTarget: 0,
    marginChange: 0,
    marginTarget: 0,
    partialUnrealizedPnL: 0,
    leverageTarget: 0,
    entryPrice: 0,
    limitPrice: 0,
    liquidationPrice: 0,
    orderCost: 0,
    requiredAllowance: 0,
    tradingFee: 0,
    loading: true,
  },
  transactions: [],
  setTransactions: noop,
  setCurrentTransaction: noop,
  onClose: noop,
};

export const TradeDialogContext = React.createContext<TradeDialogContextType>(
  tradeDialogContextDefault,
);

const TradeDialogStepComponents = {
  [TradeDialogStep.review]: ReviewStep,
  [TradeDialogStep.approval]: ApprovalStep,
  [TradeDialogStep.confirmationEven]: ConfirmationStep,
  [TradeDialogStep.confirmationOdd]: ConfirmationStep,
  [TradeDialogStep.transaction]: TransactionStep,
};

export const TradeDialog: React.FC = () => {
  const dispatch = useDispatch();

  const { modal, modalOptions, pairType } = useSelector(selectPerpetualPage);

  const { origin, trade, transactions: requestedTransactions } = useMemo(
    () =>
      isPerpetualTradeReview(modalOptions)
        ? modalOptions
        : { origin: undefined, trade: undefined, transactions: [] },
    [modalOptions],
  );

  const [transactions, setTransactions] = useState<PerpetualTx[]>(
    requestedTransactions,
  );

  const [currentTransaction, setCurrentTransaction] = useState<
    TradeDialogCurrentTransaction
  >();

  const pair = useMemo(
    () => PerpetualPairDictionary.get(trade?.pairType || pairType),
    [pairType, trade?.pairType],
  );

  const analysis = usePerpetual_analyseTrade(trade, !!currentTransaction);

  const onClose = useCallback(
    () => dispatch(actions.setModal(PerpetualPageModals.NONE)),
    [dispatch],
  );

  const context: TradeDialogContextType = useMemo(
    () => ({
      origin,
      pair,
      trade,
      analysis,
      transactions,
      currentTransaction,
      setTransactions,
      setCurrentTransaction,
      onClose,
    }),
    [origin, pair, trade, analysis, transactions, currentTransaction, onClose],
  );

  useEffect(() => {
    // reset current transaction state when modal is closed or called again
    setCurrentTransaction(undefined);
    setTransactions(requestedTransactions);
  }, [origin, requestedTransactions]);

  if (!trade) {
    return null;
  }

  return (
    <Dialog
      isOpen={modal === PerpetualPageModals.TRADE_REVIEW}
      onClose={onClose}
    >
      <TradeDialogContext.Provider value={context}>
        <TransitionSteps<TradeDialogStep>
          active={TradeDialogStep.review}
          defaultAnimation={TransitionAnimation.slideLeft}
          steps={TradeDialogStepComponents}
        />
      </TradeDialogContext.Provider>
    </Dialog>
  );
};
