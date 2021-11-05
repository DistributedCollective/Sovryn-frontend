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
  amount: string;
  entryPrice: number;
  markPrice: number;
  liquidationPrice: number;
  margin: number;
  leverage: number;
  unrealized: { baseValue: number; quoteValue: number; roe: number };
  realized: { baseValue: number; quoteValue: number };
};

const placeholderFetch = async (
  blockId: number,
): Promise<OpenPositionEntry[]> => {
  console.warn(
    'PlaceholderFetch used by usePerpetual_OpenPosition! NOT IMPLEMENTED YET!',
  );

  const markPrice = 40000 + Math.random() * 200;
  const entryPrice = 40000 + Math.random() * 200;

  const entries: OpenPositionEntry[] = [];

  for (let i = 1; i <= 10; i++) {
    const amount = 200 * i;
    entries.push({
      id: i.toString(16),
      pairType: PerpetualPairType.BTCUSD,
      type: PerpetualTradeType.MARKET,
      position: i % 2 === 0 ? TradingPosition.LONG : TradingPosition.SHORT,
      amount: toWei(amount.toString()),
      entryPrice,
      markPrice,
      liquidationPrice: markPrice - amount,
      margin: amount * 3,
      leverage: 3.115,
      unrealized: {
        baseValue: amount * 2,
        quoteValue: amount * 2,
        roe: amount / 200,
      },
      realized: {
        baseValue: amount,
        quoteValue: amount,
      },
    });
  }

  return new Promise(resolve => resolve(entries));
};

type OpenPositionHookResult = {
  loading: boolean;
  data: OpenPositionEntry[];
};

export const usePerpetual_OpenPosition = (
  address: string,
): OpenPositionHookResult => {
  const {
    data: tradeEvents,
    previousData: previousTradeEvents,
    loading,
  } = useGetTraderEvents([Event.TRADE], address.toLowerCase());

  const ammState = usePerpetual_queryAmmState();
  const traderState = usePerpetual_queryTraderState();

  const data = useMemo(() => {
    const currentTradeEvents =
      tradeEvents?.trader?.trades || previousTradeEvents?.trader?.trades;

    if (!currentTradeEvents) {
      return [];
    }
    const indexPrice = getIndexPrice(ammState);
    const markPrice = getMarkPrice(ammState);
    const base2quote = getBase2QuoteFX(ammState, true);

    console.log(currentTradeEvents);
    return currentTradeEvents
      .map(
        (trade: PerpetualTradeEvent): Nullable<OpenPositionEntry> => {
          const pair = PerpetualPairDictionary.getById(trade.perpetualId);

          if (!pair) {
            return null;
          }

          const tradeAmountWei = ABK64x64ToWei(
            BigNumber.from(trade.tradeAmount),
          );
          const tradeAmount = numberFromWei(tradeAmountWei);

          // TODO: calculate liquidationPrice
          const liquidationPrice = 0;
          // TODO: calculate leverage
          const leverage = 0;
          // TODO: calculate margin
          const margin = 0;

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
            id: trade.id,
            pairType: pair.pairType,
            type: PerpetualTradeType.LIMIT,
            position:
              tradeAmount > 0 ? TradingPosition.LONG : TradingPosition.SHORT,
            amount: tradeAmountWei,
            entryPrice: ABK64x64ToFloat(BigNumber.from(trade.price)),
            liquidationPrice,
            leverage,
            margin,
            markPrice,
            unrealized,
            realized,
          };
        },
      )
      .filter(trade => !!trade);
  }, [tradeEvents, previousTradeEvents, traderState, ammState]);

  return { data, loading };
};
