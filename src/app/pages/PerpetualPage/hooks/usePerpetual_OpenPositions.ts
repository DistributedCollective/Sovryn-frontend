import { TradingPosition } from '../../../../types/trading-position';
import {
  PerpetualPairType,
  PerpetualPairDictionary,
} from '../../../../utils/dictionaries/perpetual-pair-dictionary';
import {
  PerpetualTradeType,
  PerpetualTradeEvent,
  PerpetualPositionEvent,
} from '../types';
import {
  Event,
  OrderDirection,
  useGetTraderEvents,
} from './graphql/useGetTraderEvents';
import { useContext, useMemo, useEffect } from 'react';
import { ABK64x64ToFloat } from '../utils/contractUtils';
import { BigNumber } from 'ethers';
import {
  calculateApproxLiquidationPrice,
  getMarkPrice,
  getTraderPnL,
  getBase2CollateralFX,
  getBase2QuoteFX,
  getTraderLeverage,
} from '../utils/perpUtils';
import { PerpetualQueriesContext } from '../contexts/PerpetualQueriesContext';
import { RecentTradesContext } from '../contexts/RecentTradesContext';
import debounce from 'lodash.debounce';

export type OpenPositionEntry = {
  id: string;
  pairType: PerpetualPairType;
  type?: PerpetualTradeType;
  position?: TradingPosition;
  amount?: number;
  entryPrice?: number;
  markPrice?: number;
  liquidationPrice?: number;
  margin: number;
  leverage?: number;
  unrealized?: { baseValue: number; quoteValue: number };
  realized?: { baseValue: number; quoteValue: number };
};

type OpenPositionHookResult = {
  loading: boolean;
  data?: OpenPositionEntry;
};

export const usePerpetual_OpenPosition = (
  address: string,
  pairType: PerpetualPairType.BTCUSD,
): OpenPositionHookResult => {
  const pair = useMemo(() => PerpetualPairDictionary.get(pairType), [pairType]);

  const eventQuery = useMemo(
    () => [
      {
        event: Event.TRADE,
        orderBy: 'blockTimestamp',
        orderDirection: OrderDirection.desc,
        where: `perpetual: ${JSON.stringify(pair.id)}`,
      },
      {
        event: Event.POSITION,
        orderBy: 'startDate',
        orderDirection: OrderDirection.desc,
        where: `perpetual: ${JSON.stringify(pair.id)}`,
      },
    ],
    [pair],
  );

  // TODO: only query latest trade per pair, for performance reasons
  const {
    data: tradeEvents,
    previousData: previousTradeEvents,
    refetch,
    loading,
  } = useGetTraderEvents(address.toLowerCase(), eventQuery);

  const { latestTradeByUser } = useContext(RecentTradesContext);

  const {
    ammState,
    traderState,
    perpetualParameters: perpParameters,
  } = useContext(PerpetualQueriesContext);

  const data = useMemo(() => {
    const markPrice = getMarkPrice(ammState);
    const base2quote = getBase2QuoteFX(ammState, true);
    const base2collateral = getBase2CollateralFX(ammState, true);
    const pair = PerpetualPairDictionary.get(pairType);

    if (traderState.marginBalanceCC === 0 || !pair) {
      return;
    }

    const margin = traderState.availableCashCC;

    if (traderState.marginAccountPositionBC === 0) {
      return {
        id: pair.id,
        pairType,
        margin,
      };
    }

    const tradeAmount = traderState.marginAccountPositionBC;

    const currentTradeEvents: PerpetualTradeEvent[] | undefined =
      tradeEvents?.trader?.trades || previousTradeEvents?.trader?.trades;
    const currentTrade = currentTradeEvents?.find(
      (trade: PerpetualTradeEvent) =>
        trade?.perpetual?.id === pair.id &&
        ABK64x64ToFloat(BigNumber.from(trade.newPositionSizeBC)) ===
          traderState.marginAccountPositionBC,
    );

    const currentPositions: PerpetualPositionEvent[] | undefined =
      tradeEvents?.trader?.positions || previousTradeEvents?.trader?.positions;
    const currentPosition = currentPositions?.find(
      position =>
        position?.perpetual?.id === pair.id &&
        ABK64x64ToFloat(BigNumber.from(position.currentPositionSizeBC)) ===
          traderState.marginAccountPositionBC,
    );

    const entryPrice = currentTrade?.price
      ? ABK64x64ToFloat(BigNumber.from(currentTrade.price))
      : undefined;

    const liquidationPrice = calculateApproxLiquidationPrice(
      traderState,
      ammState,
      perpParameters,
      0,
      0,
    );

    const leverage = getTraderLeverage(traderState, ammState);

    const unrealizedQuote = getTraderPnL(traderState, ammState, perpParameters);
    const unrealized: OpenPositionEntry['unrealized'] = {
      baseValue: unrealizedQuote / base2quote,
      quoteValue: unrealizedQuote,
    };

    const totalPnLCC = currentPosition
      ? ABK64x64ToFloat(BigNumber.from(currentPosition.totalPnLCC))
      : 0;
    const realized: OpenPositionEntry['realized'] = {
      baseValue: totalPnLCC / base2collateral,
      quoteValue: (totalPnLCC / base2collateral) * base2quote,
    };

    return {
      id: pair.id,
      pairType: pair.pairType,
      type: PerpetualTradeType.MARKET,
      position: tradeAmount > 0 ? TradingPosition.LONG : TradingPosition.SHORT,
      amount: tradeAmount,
      entryPrice,
      liquidationPrice,
      leverage,
      margin,
      markPrice,
      unrealized,
      realized,
    };
  }, [
    tradeEvents,
    previousTradeEvents,
    pairType,
    traderState,
    perpParameters,
    ammState,
  ]);

  const refetchDebounced = useMemo(
    () =>
      debounce(refetch, 1000, {
        leading: false,
        trailing: true,
        maxWait: 1000,
      }),
    [refetch],
  );

  useEffect(() => {
    if (latestTradeByUser) {
      refetchDebounced();
    }
  }, [latestTradeByUser, refetchDebounced]);

  useEffect(() => {
    if (data && data.entryPrice === undefined) {
      refetchDebounced();
    }
  }, [data, refetchDebounced]);

  return { data, loading };
};
