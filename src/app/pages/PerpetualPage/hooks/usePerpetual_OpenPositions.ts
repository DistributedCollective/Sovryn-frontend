import { useEffect, useState } from 'react';
import { toWei } from 'web3-utils';
import { TradingPosition } from '../../../../types/trading-position';
import { PerpetualPairType } from '../../../../utils/dictionaries/perpetual-pair-dictionary';
import { useBlockSync } from '../../../hooks/useAccount';
import { PerpetualTradeType } from '../types';
import { PERPETUAL_SLIPPAGE_DEFAULT } from '../types';

export type OpenPositionEntry = {
  id: string;
  pair: PerpetualPairType;
  type: PerpetualTradeType;
  position: TradingPosition;
  amount: string;
  value: number;
  entryPrice: number;
  markPrice: number;
  liquidationPrice: number;
  margin: number;
  leverage: number;
  slippage: number;
  unrealized: { shortValue: number; longValue: number; roe: number };
  realized: { shortValue: number; longValue: number };
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
    const value = amount / entryPrice;
    entries.push({
      id: i.toString(16),
      pair: PerpetualPairType.BTCUSD,
      type: PerpetualTradeType.MARKET,
      position: i % 2 === 0 ? TradingPosition.LONG : TradingPosition.SHORT,
      amount: toWei(amount.toString()),
      value,
      entryPrice,
      markPrice,
      liquidationPrice: markPrice - amount,
      margin: value * 3,
      leverage: 3.115,
      slippage: PERPETUAL_SLIPPAGE_DEFAULT,
      unrealized: {
        shortValue: value * 2,
        longValue: amount * 2,
        roe: amount / 200,
      },
      realized: {
        shortValue: value,
        longValue: amount,
      },
    });
  }

  return new Promise(resolve => resolve(entries));
};

export const usePerpetual_OpenPosition = (address: string) => {
  const blockId = useBlockSync();
  const [data, setData] = useState<OpenPositionEntry[] | null>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // TODO: implement OpenPosition data fetching
    setLoading(true);
    placeholderFetch(blockId).then(data => {
      setData(data);
      setLoading(false);
    });
  }, [blockId]);

  return { data, loading };
};
