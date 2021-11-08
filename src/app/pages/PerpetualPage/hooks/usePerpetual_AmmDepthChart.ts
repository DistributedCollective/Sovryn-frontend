import { useEffect, useState } from 'react';
import { PerpetualPair } from '../../../../utils/models/perpetual-pair';
import { useBlockSync } from '../../../hooks/useAccount';
import { usePerpetual_queryAmmState } from './usePerpetual_queryAmmState';
import { getIndexPrice, getMarkPrice } from '../utils/perpUtils';

export type AmmDepthChartDataEntry = {
  price: number;
  size: number;
  total: number;
};

export type AmmDepthChartData = {
  price: number;
  indexPrice: number;
  markPrice: number;
  trend: number; // difference between now and previous block
  shorts: AmmDepthChartDataEntry[];
  longs: AmmDepthChartDataEntry[];
};

let previousPrice = 0;

const placeholderFetch = async (
  pair: PerpetualPair,
  blockId: number,
): Promise<AmmDepthChartData> => {
  console.warn(
    'PlaceholderFetch used by usePerpetual_AmmDepthChart! NOT IMPLEMENTED YET!',
  );

  const value = 40000 + Math.random() * 200;
  const trend = Math.sign(value - previousPrice);
  previousPrice = value;

  const shorts: AmmDepthChartDataEntry[] = [];
  const longs: AmmDepthChartDataEntry[] = [];

  let total = 0;
  for (let i = 1; i <= 9; i++) {
    const size = 100 * i ** 2;
    total += size;
    shorts.push({
      price: Math.round(value + i * 8.5),
      size,
      total,
    });
    longs.push({
      price: Math.round(value - i * 8.5),
      size,
      total,
    });
  }

  shorts.reverse();

  return new Promise(resolve =>
    resolve({
      price: value,
      indexPrice: value + 2.3,
      markPrice: value + 1.5,
      trend: trend,
      shorts: shorts,
      longs: longs,
    }),
  );
};

export const usePerpetual_AmmDepthChart = (pair: PerpetualPair) => {
  const blockId = useBlockSync();
  const [data, setData] = useState<AmmDepthChartData | null>();
  const ammState = usePerpetual_queryAmmState();

  const indexPrice = getIndexPrice(ammState);
  const markPrice = getMarkPrice(ammState);

  useEffect(() => {
    // TODO: implement AmmDepthChart data fetching
    placeholderFetch(pair, blockId).then(data => {
      setData(current => ({
        ...data,
        indexPrice: current?.indexPrice || 0,
        markPrice: current?.markPrice || 0,
      }));
    });
  }, [pair, blockId]);

  useEffect(() => {
    setData(
      data =>
        data && {
          ...data,
          indexPrice,
          markPrice,
        },
    );
  }, [indexPrice, markPrice]);

  return data;
};
