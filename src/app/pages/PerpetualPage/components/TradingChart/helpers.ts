import {
  generateCandleQuery,
  generateFirstCandleQuery,
  CandleDuration,
} from '../../hooks/graphql/useGetCandles';
import { ABK64x64ToFloat } from '../../utils/contractUtils';
import { BigNumber } from 'ethers';
import { PerpetualPairDictionary } from '../../../../../utils/dictionaries/perpetual-pair-dictionary';
import { ApolloClient } from '@apollo/client';

// Supported configuration options can be found here:
// https://github.com/tradingview/charting_library/wiki/JS-Api/f62fddae9ad1923b9f4c97dbbde1e62ff437b924#onreadycallback
export const supportedResolutions = [
  '1',
  '5',
  '10',
  '15',
  '30',
  '60',
  '240',
  '720',
  '1440',
  '1D',
  '3D',
  '1W',
  '1M',
];

export const config = {
  exchanges: [],
  symbols_types: [],
  supported_resolutions: supportedResolutions,
  supports_time: false,
};

export const makeApiRequest = async (
  client: ApolloClient<any>,
  candleDuration: CandleDuration,
  perpId: string,
  startTime: number,
  candleNumber: number,
  isFirstRequest: boolean,
) => {
  try {
    const query = isFirstRequest
      ? generateFirstCandleQuery(candleDuration, perpId, candleNumber)
      : generateCandleQuery(candleDuration, perpId, startTime);
    const response = await client.query({
      query,
    });
    const keys = Object.keys(response.data);
    const bars: Bar[] = response.data[keys[0]].map(item => {
      if (item.txCount !== 0) {
        return {
          time: item.periodStartUnix * 1e3,
          high: ABK64x64ToFloat(BigNumber.from(item.high)),
          low: ABK64x64ToFloat(BigNumber.from(item.low)),
          open: ABK64x64ToFloat(BigNumber.from(item.open)),
          close: ABK64x64ToFloat(BigNumber.from(item.close)),
          volume: ABK64x64ToFloat(BigNumber.from(item.totalVolume || 0)) || 0,
        };
      }

      const oracleOpenPrice = Number(item.oraclePriceOpen);

      return {
        time: item.periodStartUnix * 1e3,
        high: oracleOpenPrice,
        low: oracleOpenPrice,
        open: oracleOpenPrice,
        close: oracleOpenPrice,
        volume: 0,
      };
    });

    return bars;
  } catch (error) {
    console.error(error);
    throw new Error(`Request error: ${error}`);
  }
};

export type Bar = {
  time: number;
  low: number;
  high: number;
  open: number;
  close: number;
  volume?: number;
};

export const symbolMap = PerpetualPairDictionary.list().reduce(
  (acc, entry) => ({ ...acc, [entry.chartSymbol]: entry.id }),
  {},
);

export const resolutionMap: { [key: string]: CandleDuration } = {
  '1': CandleDuration.M_1,
  '5': CandleDuration.M_1,
  '10': CandleDuration.M_1,
  '15': CandleDuration.M_15,
  '30': CandleDuration.M_15,
  '60': CandleDuration.H_1,
  H: CandleDuration.H_1,
  '240': CandleDuration.H_4,
  '720': CandleDuration.H_4,
  '1440': CandleDuration.D_1,
  D: CandleDuration.D_1,
  '1D': CandleDuration.D_1,
  '3D': CandleDuration.D_1,
  W: CandleDuration.D_1,
  '1W': CandleDuration.D_1,
  M: CandleDuration.D_1,
  '1M': CandleDuration.D_1,
};
