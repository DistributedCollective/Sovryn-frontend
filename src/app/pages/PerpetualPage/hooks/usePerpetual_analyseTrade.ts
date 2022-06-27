import { PerpetualTrade, PerpetualTradeType, PERPETUAL_CHAIN } from '../types';
import { useRef, useMemo, useContext, useEffect, useState } from 'react';
import { useAccount } from '../../../hooks/useAccount';
import { PerpetualTradeAnalysis } from '../types';
import { PerpetualQueriesContext } from '../contexts/PerpetualQueriesContext';
import { useSelector } from 'react-redux';
import { selectPerpetualPage } from '../selectors';
import { PerpetualPairDictionary } from '../../../../utils/dictionaries/perpetual-pair-dictionary';
import {
  getSignedAmount,
  validatePositionChange,
} from '../utils/contractUtils';
import { numberFromWei } from '../../../../utils/blockchain/math-helpers';
import {
  getPrice,
  calculateSlippagePriceFromMidPrice,
  getEstimatedMarginCollateralForLimitOrder,
  getTraderPnLInCC,
  getTradingFee,
  getEstimatedMarginCollateralForTrader,
} from '@sovryn/perpetual-swap/dist/scripts/utils/perpUtils';
import { ABK64x64ToFloat } from '@sovryn/perpetual-swap/dist/scripts/utils/perpMath';
import { usePerpetual_calculateResultingPosition } from './usePerpetual_calculateResultingPosition';
import { getContract } from '../../../../utils/blockchain/contract-helpers';
import { bridgeNetwork } from '../../BridgeDepositPage/utils/bridge-network';
import { BigNumber } from 'ethers';
import { getRequiredMarginCollateralWithGasFees } from '../utils/perpUtils';
import { usePerpetual_OpenOrders } from './usePerpetual_OpenOrders';

const defaultAnalysis: PerpetualTradeAnalysis = {
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
  tradingFee: 0,
  requiredAllowance: 0,
  loading: true,
};

export const usePerpetual_analyseTrade = (
  trade?: PerpetualTrade,
  lockedIn?: boolean,
): PerpetualTradeAnalysis => {
  const account = useAccount();
  const { perpetuals } = useContext(PerpetualQueriesContext);

  const { totalCount: limitOrdersCount } = usePerpetual_OpenOrders(1, 1000);

  const { pairType, useMetaTransactions } = useSelector(selectPerpetualPage);

  const pair = useMemo(
    () => PerpetualPairDictionary.get(trade?.pairType || pairType),
    [pairType, trade?.pairType],
  );

  const ref = useRef<PerpetualTradeAnalysis>(defaultAnalysis);

  const openOrders = useRef<any[]>();
  const [requiredAllowance, setRequiredAllowance] = useState<number>();

  const {
    ammState,
    traderState,
    perpetualParameters: perpParameters,
    availableBalance,
  } = perpetuals[pair.id];

  const relayerFee = perpParameters.fReferralRebateCC;

  const {
    leverage: leverageTarget,
    size: amountTarget,
    estimatedLiquidationPrice,
    estimatedMargin: estimatedMarginTarget,
  } = usePerpetual_calculateResultingPosition(trade);

  const analysis = useMemo(() => {
    if (lockedIn) {
      // Do not recompute
      return ref.current;
    }

    // reset analysis
    if (!trade || !account) {
      openOrders.current = [];
      return defaultAnalysis;
    }

    const isLimitOrder =
      [PerpetualTradeType.LIMIT, PerpetualTradeType.STOP].includes(
        trade?.tradeType,
      ) && trade.limit;

    const amountChange = getSignedAmount(trade.position, trade.amount);

    const entryPrice = isLimitOrder
      ? numberFromWei(trade.limit)
      : getPrice(amountChange, perpParameters, ammState);

    const limitPrice = isLimitOrder
      ? numberFromWei(trade.limit)
      : calculateSlippagePriceFromMidPrice(
          perpParameters,
          ammState,
          trade.slippage,
          Math.sign(amountChange),
        );

    const marginChange = estimatedMarginTarget - traderState.availableCashCC;

    let orderCost = Math.max(0, marginChange);

    if (isLimitOrder) {
      orderCost =
        getEstimatedMarginCollateralForLimitOrder(
          perpParameters,
          ammState,
          trade.leverage,
          amountChange,
          numberFromWei(trade.limit),
          trade.trigger && trade.trigger !== '0'
            ? numberFromWei(trade.trigger)
            : undefined,
        ) + relayerFee;
    } else if (amountChange !== 0) {
      orderCost = getRequiredMarginCollateralWithGasFees(
        leverageTarget,
        amountTarget,
        perpParameters,
        ammState,
        traderState,
        trade.slippage,
        useMetaTransactions,
        true,
        true,
      );
    }

    const partialUnrealizedPnL =
      getTraderPnLInCC(traderState, ammState, perpParameters, limitPrice) *
      Math.abs(-marginChange / traderState.availableCashCC);

    const tradingFee = getTradingFee(amountChange, perpParameters, ammState);

    const analysis: PerpetualTradeAnalysis = {
      amountChange,
      amountTarget,
      marginChange,
      marginTarget: estimatedMarginTarget,
      partialUnrealizedPnL,
      leverageTarget,
      liquidationPrice: estimatedLiquidationPrice,
      entryPrice,
      limitPrice,
      orderCost,
      tradingFee,
      requiredAllowance: requiredAllowance || 0,
      loading: requiredAllowance === undefined,
    };

    analysis.validation = validatePositionChange(
      analysis,
      numberFromWei(availableBalance),
      traderState,
      perpParameters,
      ammState,
      trade.tradeType,
      limitOrdersCount,
    );

    return analysis;
  }, [
    lockedIn,
    trade,
    account,
    perpParameters,
    ammState,
    estimatedMarginTarget,
    traderState,
    amountTarget,
    leverageTarget,
    estimatedLiquidationPrice,
    requiredAllowance,
    availableBalance,
    limitOrdersCount,
    useMetaTransactions,
  ]);

  useEffect(() => {
    // reset cached orders result
    openOrders.current = undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, origin]);

  useEffect(() => {
    if (lockedIn) {
      return;
    }

    if (!trade) {
      setRequiredAllowance(undefined);
      return;
    }

    const fetchRequiredAllowance = async () => {
      const contract = getContract(pair.limitOrderBook);

      let orders: any[];
      if (openOrders.current) {
        orders = openOrders.current;
      } else {
        orders = await bridgeNetwork.call(
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
        openOrders.current = orders;
      }

      const requiredAllowance =
        getEstimatedMarginCollateralForTrader(
          analysis.amountChange,
          trade.leverage,
          orders,
          perpParameters,
          ammState,
          traderState,
          trade.slippage,
          trade.limit ? numberFromWei(trade.limit) : null,
          trade.trigger ? numberFromWei(trade.trigger) : null,
        ) || 0;

      if (analysis.amountChange === 0) {
        // only margin is being changed,
        // so take the open orders allowance and add the order cost.
        return requiredAllowance + analysis.orderCost;
      }
      return requiredAllowance;
    };

    const isAllowanceRequired = analysis.marginChange > 0;

    let cancelled = false;
    if (isAllowanceRequired) {
      fetchRequiredAllowance()
        .then(requiredAllowance => {
          if (cancelled) {
            return;
          }
          // add 1% allowance to account for estimation accuracy
          const requiredAllowanceWithMargin = requiredAllowance * 1.01;
          setRequiredAllowance(requiredAllowanceWithMargin);
        })
        .catch(console.error);
    } else {
      setRequiredAllowance(0);
    }

    return () => {
      cancelled = true;
    };
  }, [
    lockedIn,
    analysis,
    account,
    ammState,
    perpParameters,
    traderState,
    pair.id,
    pair.limitOrderBook,
    trade,
  ]);

  useEffect(() => {
    ref.current = analysis;
  }, [ref, analysis]);

  return analysis;
};
