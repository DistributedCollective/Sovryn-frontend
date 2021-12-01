import { useContext, useMemo, useRef } from 'react';
import { PerpetualPair } from '../../../../utils/models/perpetual-pair';
import {
  getIndexPrice,
  getMarkPrice,
  getDepthMatrix,
} from '../utils/perpUtils';
import { PerpetualQueriesContext } from '../contexts/PerpetualQueriesContext';

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
  trend: number; // difference between now and previous block
  shorts: AmmDepthChartDataEntry[];
  longs: AmmDepthChartDataEntry[];
};

export const usePerpetual_AmmDepthChart = (
  pair: PerpetualPair,
): AmmDepthChartData => {
  const { ammState, perpetualParameters } = useContext(PerpetualQueriesContext);
  const previousMidPrice = useRef<number>();

  const data = useMemo(() => {
    const indexPrice = getIndexPrice(ammState);
    const markPrice = getMarkPrice(ammState);
    const entries = getDepthMatrix(perpetualParameters, ammState);

    let shorts: AmmDepthChartDataEntry[] = [];
    let longs: AmmDepthChartDataEntry[] = [];
    let midPrice = 0;
    let trend = 0;
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
        } else {
          trend = previousMidPrice.current
            ? Math.sign(price - previousMidPrice.current)
            : 0;
          previousMidPrice.current = price;
          midPrice = price;
        }
      }
    }

    // TODO use latest trade from websocket server for price and trend

    return {
      price: midPrice,
      trend,
      indexPrice,
      markPrice,
      shorts,
      longs,
    };
  }, [perpetualParameters, ammState]);

  return data;
};
