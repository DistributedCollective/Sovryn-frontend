import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useContext,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from '../../../../containers/Dialog';
import { selectPerpetualPage } from '../../selectors';
import { actions } from '../../slice';
import { PerpetualPageModals, isPerpetualTradeReview } from '../../types';
import {
  calculateApproxLiquidationPrice,
  getRequiredMarginCollateral,
  getTradingFee,
  calculateLeverage,
  getTraderPnLInCC,
  calculateSlippagePriceFromMidPrice,
  getPrice,
} from '../../utils/perpUtils';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from 'utils/dictionaries/perpetual-pair-dictionary';
import { getSignedAmount } from '../../utils/contractUtils';
import {
  TradeAnalysis,
  TradeDialogContextType,
  TradeDialogStep,
  TradeDialogCurrentTransaction,
  PerpetualTx,
} from './types';
import { noop } from '../../../../constants';
import { TransitionSteps } from '../../../../containers/TransitionSteps';
import { TransitionAnimation } from '../../../../containers/TransitionContainer';
import { ReviewStep } from './components/ReviewStep';
import { ApprovalStep } from './components/ApprovalStep';
import { ConfirmationStep } from './components/ConfirmationStep';
import { TransactionStep } from './components/TransactionStep';
import { PerpetualQueriesContext } from '../../contexts/PerpetualQueriesContext';
import { numberFromWei } from '../../../../../utils/blockchain/math-helpers';

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
    tradingFee: 0,
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
  [TradeDialogStep.confirmation]: ConfirmationStep,
  [TradeDialogStep.transaction]: TransactionStep,
};

export const TradeDialog: React.FC = () => {
  const dispatch = useDispatch();
  const { modal, modalOptions } = useSelector(selectPerpetualPage);

  const {
    ammState,
    traderState,
    perpetualParameters: perpParameters,
  } = useContext(PerpetualQueriesContext);

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
    () =>
      PerpetualPairDictionary.get(trade?.pairType || PerpetualPairType.BTCUSD),
    [trade],
  );

  const [analysis, setAnalysis] = useState<TradeAnalysis>(
    tradeDialogContextDefault.analysis,
  );

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

  useEffect(() => setTransactions(requestedTransactions), [
    requestedTransactions,
  ]);

  useEffect(() => {
    if (!trade) {
      setAnalysis(tradeDialogContextDefault.analysis);
      return;
    }

    if (currentTransaction) {
      return;
    }

    const amountTarget = getSignedAmount(trade.position, trade.amount);
    const amountChange = amountTarget - traderState.marginAccountPositionBC;

    const entryPrice = getPrice(amountChange, perpParameters, ammState);
    const limitPrice = calculateSlippagePriceFromMidPrice(
      perpParameters,
      ammState,
      trade.slippage,
      Math.sign(amountChange),
    );

    const marginTarget = trade.margin
      ? numberFromWei(trade.margin)
      : traderState.availableCashCC +
        getRequiredMarginCollateral(
          trade.leverage,
          amountTarget,
          perpParameters,
          ammState,
          traderState,
          trade.slippage,
        );
    const marginChange = marginTarget - traderState.availableCashCC;

    const partialUnrealizedPnL =
      getTraderPnLInCC(traderState, ammState, perpParameters, limitPrice) *
      Math.abs(-marginChange / traderState.availableCashCC);

    const leverageTarget = calculateLeverage(
      amountTarget,
      marginTarget,
      ammState,
    );

    const liquidationPrice = calculateApproxLiquidationPrice(
      traderState,
      ammState,
      perpParameters,
      amountChange,
      marginChange,
    );

    const tradingFee = getTradingFee(Math.abs(amountChange), perpParameters);

    setAnalysis({
      amountChange,
      amountTarget,
      marginChange,
      partialUnrealizedPnL,
      marginTarget,
      leverageTarget,
      liquidationPrice,
      tradingFee,
      entryPrice,
      limitPrice,
    });
  }, [currentTransaction, trade, traderState, perpParameters, ammState]);

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
