import { toWei, fromWei } from 'web3-utils';
import { TradingPosition } from '../../../../types/trading-position';
import {
  PerpetualPairType,
  PerpetualPairDictionary,
} from '../../../../utils/dictionaries/perpetual-pair-dictionary';
import {
  PerpetualTradeType,
  PERPETUAL_SLIPPAGE_DEFAULT,
  PerpetualTradeEvent,
} from '../types';
import { Event, useGetTraderEvents } from './graphql/useGetTraderEvents';
import { useMemo } from 'react';
import { ABK64x64ToFloat, ABK64x64ToWei } from '../utils/contractUtils';
import { BigNumber } from 'ethers';
import { Nullable } from '../../../../types';
import { usePerpetual_queryAmmState } from './usePerpetual_queryAmmState';
import {
  getIndexPrice,
  getMarkPrice,
  getTraderPnL,
  getBase2QuoteFX,
  getBase2CollateralFX,
} from '../utils/perpUtils';
import { usePerpetual_queryTraderState } from './usePerpetual_queryTraderState';
import { numberFromWei } from '../../../../utils/blockchain/math-helpers';

export type OpenPositionEntry = {
  id: string;
  pairType: PerpetualPairType;
  type: PerpetualTradeType;
  position: TradingPosition;
  amount: number;
  entryPrice?: number;
  markPrice: number;
  liquidationPrice: number;
  margin: number;
  leverage: number;
  unrealized: { baseValue: number; quoteValue: number; roe: number };
  realized: { baseValue: number; quoteValue: number };
};

type OpenPositionHookResult = {
  loading: boolean;
  data?: OpenPositionEntry;
};

export const usePerpetual_OpenPosition = (
  address: string,
  pairType: PerpetualPairType.BTCUSD,
): OpenPositionHookResult => {
  const {
    data: tradeEvents,
    previousData: previousTradeEvents,
    loading,
  } = useGetTraderEvents([Event.TRADE], address.toLowerCase());

  const ammState = usePerpetual_queryAmmState();
  const traderState = usePerpetual_queryTraderState();
  console.log('traderState', traderState);

  const data = useMemo(() => {
    const indexPrice = getIndexPrice(ammState);
    const markPrice = getMarkPrice(ammState);
    const base2quote = getBase2QuoteFX(ammState, true);
    const base2collateral = getBase2CollateralFX(ammState, true);
    const pair = PerpetualPairDictionary.get(pairType);

    if (traderState.marginAccountPositionBC === 0 || !pair) {
      return;
    }

    const currentTradeEvents: PerpetualTradeEvent[] | undefined =
      tradeEvents?.trader?.trades || previousTradeEvents?.trader?.trades;
    const latestTrade = currentTradeEvents?.find(
      (trade: PerpetualTradeEvent) => trade.perpetualId === pair.id,
    );

    const entryPrice = latestTrade?.price
      ? ABK64x64ToFloat(BigNumber.from(latestTrade.price))
      : undefined;

    const tradeAmount = traderState.marginAccountPositionBC;

    // TODO: calculate liquidationPrice
    const liquidationPrice = 0;
    // TODO: calculate leverage
    const leverage = 0;
    const margin = traderState.marginAccountCashCC * base2collateral;

    const unrealizedQuote = getTraderPnL(traderState, ammState);
    const unrealized: OpenPositionEntry['unrealized'] = {
      baseValue: unrealizedQuote / base2quote,
      quoteValue: unrealizedQuote,
      roe: unrealizedQuote / base2quote / tradeAmount,
    };

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
  }, [tradeEvents, previousTradeEvents, traderState, ammState, pairType]);

  return { data, loading };
};
