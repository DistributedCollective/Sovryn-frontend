import { useMemo, useContext } from 'react';
import { PerpetualPair } from '../../../../utils/models/perpetual-pair';
import { usePerpetual_queryAmmState } from './usePerpetual_queryAmmState';
import {
  getIndexPrice,
  getMarkPrice,
  getDepthMatrix,
} from '../utils/perpUtils';
import { usePerpetual_queryPerpParameters } from './usePerpetual_queryPerpParameters';
import { RecentTradesContext } from '../components/RecentTradesTable/context';
import { TradePriceChange } from '../components/RecentTradesTable/types';

export type AmmDepthChartDataEntry = {
  id: number;
  price: number;
  deviation: number;
  amount: number;
};

export type AmmDepthChartData = {
  price: number;
  indexPrice: number;
  markPrice: number;
  trend: TradePriceChange; // difference between now and previous block
  shorts: AmmDepthChartDataEntry[];
  longs: AmmDepthChartDataEntry[];
};

export const usePerpetual_AmmDepthChart = (
  pair: PerpetualPair,
): AmmDepthChartData => {
  const perpertualParameters = usePerpetual_queryPerpParameters();
  const ammState = usePerpetual_queryAmmState();

  const { trades } = useContext(RecentTradesContext);

  const data = useMemo(() => {
    const indexPrice = getIndexPrice(ammState);
    const markPrice = getMarkPrice(ammState);
    const entries = getDepthMatrix(perpertualParameters, ammState);

    let shorts: AmmDepthChartDataEntry[] = [];
    let longs: AmmDepthChartDataEntry[] = [];

    if (entries && entries.length >= 3) {
      const length = entries[0].length;
      const midIndex = Math.floor(length / 2);
      for (let i = 0; i < length; i++) {
        const price = entries[0][i];
        const deviation = entries[1][i];
        const amount = entries[2][i];
        if (i < midIndex) {
          shorts.push({
            id: i,
            price,
            deviation: Math.abs(deviation),
            amount: Math.abs(amount),
          });
        } else if (i > midIndex) {
          longs.push({
            id: i,
            price,
            deviation: Math.abs(deviation),
            amount: Math.abs(amount),
          });
        }
      }
    }

    return {
      price: trades[0]?.price || markPrice,
      trend: trades[0]?.priceChange || TradePriceChange.NO_CHANGE,
      indexPrice,
      markPrice,
      shorts,
      longs,
    };
  }, [trades, perpertualParameters, ammState]);

  return data;
};
