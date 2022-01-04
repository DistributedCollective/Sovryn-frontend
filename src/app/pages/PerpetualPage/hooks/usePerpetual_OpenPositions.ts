import { TradingPosition } from '../../../../types/trading-position';
import {
  PerpetualPairType,
  PerpetualPairDictionary,
} from '../../../../utils/dictionaries/perpetual-pair-dictionary';
import { PerpetualTradeType, PerpetualTradeEvent } from '../types';
import {
  Event,
  OrderDirection,
  useGetTraderEvents,
} from './graphql/useGetTraderEvents';
import { useContext, useMemo } from 'react';
import { ABK64x64ToFloat } from '../utils/contractUtils';
import { BigNumber } from 'ethers';
import {
  calculateApproxLiquidationPrice,
  getMarkPrice,
  getTraderPnL,
  getBase2QuoteFX,
  getTraderLeverage,
} from '../utils/perpUtils';
import { PerpetualQueriesContext } from '../contexts/PerpetualQueriesContext';

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
  // TODO: only query latest trade per pair, for performance reasons
  const {
    data: tradeEvents,
    previousData: previousTradeEvents,
    loading,
  } = useGetTraderEvents(
    [Event.TRADE],
    address.toLowerCase(),
    'blockTimestamp',
    OrderDirection.desc,
  );

  const {
    ammState,
    traderState,
    perpetualParameters: perpParameters,
  } = useContext(PerpetualQueriesContext);

  const data = useMemo(() => {
    const markPrice = getMarkPrice(ammState);
    const base2quote = getBase2QuoteFX(ammState, true);
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
    const latestTrade = currentTradeEvents?.find(
      (trade: PerpetualTradeEvent) => trade?.perpetual?.id === pair.id,
    );

    const entryPrice = latestTrade?.price
      ? ABK64x64ToFloat(BigNumber.from(latestTrade.price))
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

    // TODO: calculate Realized Profit and Loss
    const realized: OpenPositionEntry['realized'] = {
      baseValue: 0,
      quoteValue: 0,
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

  return { data, loading };
};
