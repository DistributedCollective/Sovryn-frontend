import { useMemo, useContext } from 'react';
import { PerpetualPair } from '../../../../utils/models/perpetual-pair';
import { getIndexPrice, getMarkPrice } from '../utils/perpUtils';
import { PerpetualQueriesContext } from '../contexts/PerpetualQueriesContext';
import { RecentTradesContext } from '../contexts/RecentTradesContext';
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
  const { ammState, depthMatrixEntries: entries, averagePrice } = useContext(
    PerpetualQueriesContext,
  );
  const { trades } = useContext(RecentTradesContext);

  const data = useMemo(() => {
    const indexPrice = getIndexPrice(ammState);
    const markPrice = getMarkPrice(ammState);

    let shorts: AmmDepthChartDataEntry[] = [];
    let longs: AmmDepthChartDataEntry[] = [];

    if (entries && entries.length >= 3) {
      const length = entries[0].length;
      const midIndex = Math.floor(length / 2);

      for (let i = length - 1; i >= 0; i--) {
        const price = entries[0][i];
        const deviation = entries[1][i];
        const amount = entries[2][i];
        if (i < midIndex) {
          longs.push({
            id: i,
            price,
            deviation: Math.abs(deviation),
            amount: Math.abs(amount),
          });
        } else if (i > midIndex) {
          shorts.push({
            id: i,
            price,
            deviation: Math.abs(deviation),
            amount: Math.abs(amount),
          });
        }
      }
    }

    return {
      price: averagePrice,
      trend: trades[0]?.priceChange || TradePriceChange.NO_CHANGE,
      indexPrice,
      markPrice,
      shorts,
      longs,
    };
  }, [ammState, averagePrice, entries, trades]);

  return data;
};
