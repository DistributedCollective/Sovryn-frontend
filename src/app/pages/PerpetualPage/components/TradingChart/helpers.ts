import { apolloClient } from '../../utils/graphQlHelpers';
import {
  generateCandleQuery,
  generateFirstCandleQuery,
  CandleDuration,
  CandleDictionary,
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

const addMissingBars = (bars: Bar[], candleDuration: CandleDuration): Bar[] => {
  const candleDetails = CandleDictionary.get(candleDuration);
  const seconds = candleDetails.candleSeconds * 1e3;
  let newBars: Bar[] = [];
  for (let i = 0; i < bars.length; i++) {
    const now = new Date().getTime();
    const latestBar = Math.floor(now / seconds) * seconds;
    if (bars[bars.length - 1].time !== latestBar) {
      bars.push({
        time: latestBar,
        open: bars[bars.length - 1].close,
        high: bars[bars.length - 1].close,
        low: bars[bars.length - 1].close,
        close: bars[bars.length - 1].close,
        volume: 0,
      });
    }
    if (i === 0) {
      newBars.push(bars[i]);
    } else if (bars[i].time === newBars[newBars.length - 1].time + seconds) {
      /** Is next bar in sequence */
      console.log('IS NEXT BAR: ', bars[i]);
      newBars.push(bars[i]);
    } else {
      const extraBar = {
        high: newBars[newBars.length - 1].close,
        low: newBars[newBars.length - 1].close,
        open: newBars[newBars.length - 1].close,
        close: newBars[newBars.length - 1].close,
        volume: 0,
      };
      let startTime = newBars[newBars.length - 1].time + seconds;
      while (startTime < bars[i].time) {
        const newBar = {
          ...extraBar,
          time: startTime,
          time2: new Date(startTime).toLocaleString(),
        };
        newBars.push(newBar);
        startTime += seconds;
      }
      console.debug(
        'New bar time reached: ' + new Date(startTime).toLocaleString(),
      );
      newBars.push(bars[i]);
    }
  }
  return newBars;
};

export const makeApiRequest = async (
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
    const response = await apolloClient.query({
      query,
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
    const newBars = addMissingBars(bars, candleDuration);
    return newBars;
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

// TODO: use Perpetual ID from PerpetualPairDictionary for SymbolMap
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
  '1W': CandleDuration.D_1,
  M: CandleDuration.D_1,
  '1M': CandleDuration.D_1,
};
