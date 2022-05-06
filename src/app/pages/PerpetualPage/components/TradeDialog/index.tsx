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
import {
  PerpetualPageModals,
  isPerpetualTradeReview,
  PerpetualTrade,
  PerpetualTradeType,
  PERPETUAL_SLIPPAGE_DEFAULT,
  PERPETUAL_CHAIN,
} from '../../types';
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
import { perpUtils } from '@sovryn/perpetual-swap';
import { usePerpetual_calculateResultingPosition } from '../../hooks/usePerpetual_calculateResultingPosition';
import { Asset } from 'types';
import { TradingPosition } from 'types/trading-position';
import { bridgeNetwork } from '../../../BridgeDepositPage/utils/bridge-network';
import { getContract } from '../../../../../utils/blockchain/contract-helpers';
import { useAccount } from '../../../../hooks/useAccount';
import { BigNumber } from 'ethers';
import { ABK64x64ToFloat } from '@sovryn/perpetual-swap/dist/scripts/utils/perpMath';
import { valid } from 'semver';

const {
  calculateApproxLiquidationPrice,
  getRequiredMarginCollateral,
  getEstimatedMarginCollateralForTrader,
  getTradingFee,
  getTraderPnLInCC,
  calculateSlippagePriceFromMidPrice,
  getPrice,
  calculateLeverage,
} = perpUtils;

const EMPTY_TRADE: PerpetualTrade = {
  pairType: PerpetualPairType.BTCUSD,
  collateral: Asset.BTCS,
  tradeType: PerpetualTradeType.MARKET,
  position: TradingPosition.LONG,
  amount: '0',
  leverage: 0,
  slippage: PERPETUAL_SLIPPAGE_DEFAULT,
  entryPrice: '0',
};

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
  [TradeDialogStep.confirmation]: ConfirmationStep,
  [TradeDialogStep.transaction]: TransactionStep,
};

export const TradeDialog: React.FC = () => {
  const dispatch = useDispatch();
  const account = useAccount();

  const { modal, modalOptions, useMetaTransactions, pairType } = useSelector(
    selectPerpetualPage,
  );

  const { perpetuals } = useContext(PerpetualQueriesContext);
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

  const {
    ammState,
    traderState,
    perpetualParameters: perpParameters,
  } = perpetuals[pair.id];

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

  useEffect(() => {
    setCurrentTransaction(undefined);
    setTransactions(requestedTransactions);
  }, [origin, requestedTransactions]);

  const {
    liquidationPrice: resultingLiquidationPrice,
    leverage: resultingLeverage,
    size: resultingSize,
    margin: resultingMargin,
  } = usePerpetual_calculateResultingPosition(
    trade || EMPTY_TRADE,
    trade?.keepPositionLeverage,
  );

  const isNewTradeForm = useMemo(() => origin === PerpetualPageModals.NONE, [
    origin,
  ]);

  useEffect(() => {
    if (!trade || !account) {
      return setAnalysis(tradeDialogContextDefault.analysis);
    }

    if (currentTransaction) {
      // Do not recompute after confirmation happened in ReviewStep
      return;
    }

    const amountTarget = getSignedAmount(trade.position, trade.amount);
    const amountChange = amountTarget - traderState.marginAccountPositionBC;

    const entryPrice = getPrice(
      isNewTradeForm ? amountTarget : amountChange,
      perpParameters,
      ammState,
    );

    const limitPrice = calculateSlippagePriceFromMidPrice(
      perpParameters,
      ammState,
      trade.slippage,
      Math.sign(isNewTradeForm ? amountTarget : amountChange),
    );

    const marginTarget = trade.margin
      ? numberFromWei(trade.margin)
      : Math.abs(amountTarget) / trade.leverage;

    let orderCost = getRequiredMarginCollateral(
      trade.leverage,
      amountTarget,
      perpParameters,
      ammState,
      traderState,
      trade.slippage,
      false,
      false,
    );

    const marginChange = marginTarget - traderState.availableCashCC;

    const partialUnrealizedPnL =
      getTraderPnLInCC(traderState, ammState, perpParameters, limitPrice) *
      Math.abs(-marginChange / traderState.availableCashCC);

    const liquidationPrice = calculateApproxLiquidationPrice(
      traderState,
      ammState,
      perpParameters,
      amountChange,
      marginChange,
    );

    const tradingFee = getTradingFee(
      Math.abs(isNewTradeForm ? amountTarget : amountChange),
      perpParameters,
      ammState,
    );

    const leverageTarget = calculateLeverage(
      amountTarget,
      marginTarget,
      traderState,
      ammState,
      perpParameters,
    );

    const fetchRequiredAllowance = async () => {
      const contract = getContract(pair.limitOrderBook);
      let orders = await bridgeNetwork.call(
        PERPETUAL_CHAIN,
        contract.address,
        contract.abi,
        'getOrders',
        [account.toLowerCase(), 0, 1000],
      );

      orders = Array.isArray(orders)
        ? orders
            // filter empty placeholders
            .filter(entry => entry?.traderAddr === account)
            // resolve all BigNumber objects to float
            .map(entry =>
              Object.entries(entry).reduce((acc, [key, value]) => {
                acc[key] =
                  typeof value === 'object'
                    ? (acc[key] = ABK64x64ToFloat(BigNumber.from(value)))
                    : value;
                return acc;
              }, {}),
            )
        : [];

      console.log({
        orders,
        amountTarget,
        leverage: trade.leverage,
        perpParameters,
        ammState,
        traderState,
        slippage: trade.slippage,
        limit: trade.limit ? numberFromWei(trade.limit) : null,
        trigger: trade.trigger ? numberFromWei(trade.trigger) : null,
      });
      return getEstimatedMarginCollateralForTrader(
        amountTarget,
        trade.leverage,
        orders,
        perpParameters,
        ammState,
        traderState,
        trade.slippage,
        trade.limit ? numberFromWei(trade.limit) : null,
        trade.trigger ? numberFromWei(trade.trigger) : null,
      );
    };

    const requiresApproval =
      marginChange > 0 ||
      (trade?.tradeType &&
        [PerpetualTradeType.LIMIT, PerpetualTradeType.STOP].includes(
          trade?.tradeType,
        ));

    let cancelled = false;
    if (requiresApproval) {
      fetchRequiredAllowance()
        .then(requiredAllowance => {
          if (cancelled) {
            return;
          }
          setAnalysis(analysis => ({
            ...analysis,
            requiredAllowance: requiredAllowance * 1.1,
            loading: false,
          }));
          console.log('requiredAllowance', requiredAllowance);
        })
        .catch(console.error);
    }

    setAnalysis(analysis => ({
      amountChange: isNewTradeForm ? amountTarget : amountChange,
      amountTarget: isNewTradeForm ? resultingSize : amountTarget,
      marginChange,
      partialUnrealizedPnL,
      marginTarget: isNewTradeForm ? resultingMargin : marginTarget,
      leverageTarget: isNewTradeForm ? resultingLeverage : leverageTarget,
      liquidationPrice: isNewTradeForm
        ? resultingLiquidationPrice
        : liquidationPrice,
      entryPrice,
      limitPrice,
      orderCost,
      tradingFee,
      requiredAllowance: 0,
      loading: requiresApproval,
    }));

    return () => {
      cancelled = true;
    };
  }, [
    account,
    pair,
    currentTransaction,
    trade,
    traderState,
    perpParameters,
    ammState,
    useMetaTransactions,
    origin,
    resultingSize,
    resultingLeverage,
    resultingLiquidationPrice,
    isNewTradeForm,
    resultingMargin,
  ]);

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
