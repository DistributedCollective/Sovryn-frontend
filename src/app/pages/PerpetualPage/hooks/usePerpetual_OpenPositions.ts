import { useEffect, useState } from 'react';
import { PerpetualPairType } from '../../../../utils/dictionaries/perpatual-pair-dictionary';
import { useBlockSync } from '../../../hooks/useAccount';

export type OpenPositionEntry = {
  id: string;
  pair: keyof typeof PerpetualPairType;
  position: number;
  value: number;
  entryPrice: number;
  markPrice: number;
  liquidationPrice: number;
  margin: number;
  leverage: number;
  /** [shortAssetValue, longAssetValue, returnOnEquity] */
  unrealized: [number, number, number];
  /** [shortAssetValue, longAssetValue] */
  realized: [number, number];
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
    const position = 200 * ((i % 2) - 0.5);
    const value = position / entryPrice;
    entries.push({
      id: i.toString(16),
      pair: PerpetualPairType.BTCUSD,
      position,
      value,
      entryPrice,
      markPrice,
      liquidationPrice: markPrice - position,
      margin: value * 3,
      leverage: 3.115,
      unrealized: [value * 2, position * 2, position / 200],
      realized: [value, position],
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
