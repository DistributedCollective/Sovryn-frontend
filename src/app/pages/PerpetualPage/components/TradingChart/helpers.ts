import { apolloClient } from '../../utils/graphQlHelpers';
import {
  generateCandleQuery,
  CandleDuration,
} from '../../hooks/graphql/useGetCandles';
import { weiTo2 } from 'utils/blockchain/math-helpers';

// Supported configuration options can be found here:
// https://github.com/tradingview/charting_library/wiki/JS-Api/f62fddae9ad1923b9f4c97dbbde1e62ff437b924#onreadycallback
export const supportedResolutions = [
  '1',
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
  candleDuration: CandleDuration,
  perpId: string,
  startTime: number,
  endTime: number,
) => {
  console.log('Making api request for candles...');
  try {
    const query = generateCandleQuery(candleDuration, perpId, startTime);
    console.debug(query.loc?.source.body);
    const response = await apolloClient.query({
      query: query,
    });
    const keys = Object.keys(response.data);
    const bars: Bar[] = response.data[keys[0]].map(item => {
      return {
        time: item.periodStartUnix * 1e3,
        high: parseFloat(weiTo2(item.high)),
        low: parseFloat(weiTo2(item.low)),
        open: parseFloat(weiTo2(item.open)),
        close: parseFloat(weiTo2(item.close)),
        volume: parseFloat(weiTo2(item.totalVolume)),
      };
    });
    console.debug(bars);
    return bars;
  } catch (error) {
    console.log(error);
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

export const symbolMap = {
  'BTC/USD':
    '0xada5013122d395ba3c54772283fb069b10426056ef8ca54750cb9bb552a59e7d',
};

export const resolutionMap: { [key: string]: CandleDuration } = {
  '1': CandleDuration.M_1,
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
  '1M': CandleDuration.D_1,
  M: CandleDuration.D_1,
};
