/**
 * TradingChart Datafeed
 *
 * Implementation of TradingView Charting Library JS API (v18.043):
 * https://github.com/tradingview/charting_library/wiki/JS-Api/f62fddae9ad1923b9f4c97dbbde1e62ff437b924
 *
 * If the version of the library is updated, then modifications may
 * be necessary to this file and the realtime streaming.ts file in
 * this directory. Refer to:
 * https://github.com/tradingview/charting_library/wiki/Breaking-Changes
 */

import { subscribeOnStream, unsubscribeFromStream } from './streaming';
import { apolloClient } from '../../graphQlHelpers';
import {
  generateCandleQuery,
  CandleDuration,
} from '../../hooks/graphql/useGetCandles';
import { weiTo2 } from 'utils/blockchain/math-helpers';

export const supportedResolutions = [
  '10',
  '20',
  '30',
  '60',
  '120',
  '240',
  '360',
  '720',
  '1D',
  '3D',
  '1W',
  '1M',
];
const MAX_DAYS = 5;
const MAX_MONTHS = 1;

const lastBarCache = new Map<string, Bar>();

// Supported configuration options can be found here:
// https://github.com/tradingview/charting_library/wiki/JS-Api/f62fddae9ad1923b9f4c97dbbde1e62ff437b924#onreadycallback
const config = {
  exchanges: [],
  symbols_types: [],
  supported_resolutions: supportedResolutions,
  supports_time: false,
};

const makeApiRequest = async (
  candleDuration: CandleDuration,
  perpId: string,
  startTime: number,
) => {
  console.log('Making api request for candles...');
  try {
    const response = await apolloClient.query({
      query: generateCandleQuery(candleDuration, perpId, startTime),
    });
    const keys = Object.keys(response.data);
    const bars: Bar[] = response.data[keys[0]].map(item => {
      return {
        time: item.periodStartUnix * 1e3,
        high: parseFloat(weiTo2(item.high)),
        low: parseFloat(weiTo2(item.low)),
        open: parseFloat(weiTo2(item.open)),
        close: parseFloat(weiTo2(item.close)),
      };
    });
    console.log(bars);
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

const tradingChartDataFeeds = {
  // https://github.com/tradingview/charting_library/wiki/JS-Api/f62fddae9ad1923b9f4c97dbbde1e62ff437b924#onreadycallback
  onReady: callback => {
    setTimeout(() => callback(config));
  },

  // https://github.com/tradingview/charting_library/wiki/JS-Api/f62fddae9ad1923b9f4c97dbbde1e62ff437b924#searchsymbolsuserinput-exchange-symboltype-onresultreadycallback
  searchSymbols: async (
    userInput,
    exchange,
    symbolType,
    onResultReadyCallback,
  ) => {
    // disabled via chart config in index.tsx
  },

  // https://github.com/tradingview/charting_library/wiki/JS-Api/f62fddae9ad1923b9f4c97dbbde1e62ff437b924#resolvesymbolsymbolname-onsymbolresolvedcallback-onresolveerrorcallback-extension
  resolveSymbol: async (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback,
  ) => {
    const symbolInfo = {
      name: symbolName,
      description: '',
      type: 'crypto',
      session: '24x7',
      timezone: 'Etc/UTC',
      ticker: symbolName,
      minmov: 1, //0.00000001,
      pricescale: 100,
      has_intraday: true,
      intraday_multipliers: ['15', '60'],
      supported_resolution: supportedResolutions,
      has_no_volume: true,
      has_empty_bars: true,
      has_daily: false,
      has_weekly_and_monthly: false,
      data_status: 'streaming',
    };

    setTimeout(() => onSymbolResolvedCallback(symbolInfo));
  },

  // https://github.com/tradingview/charting_library/wiki/JS-Api/f62fddae9ad1923b9f4c97dbbde1e62ff437b924#getbarssymbolinfo-resolution-periodparams-onhistorycallback-onerrorcallback
  getBars: async (
    symbolInfo,
    resolution,
    from,
    to,
    onHistoryCallback,
    onErrorCallback,
    firstDataRequest,
  ) => {
    console.log('GETTING BARS');
    const now = Math.floor(new Date().getTime() / 1000) - 86400;
    console.log(now);
    const candleDuration: CandleDuration =
      resolution === '15' ? CandleDuration.M_15 : CandleDuration.H_1;
    try {
      const data = await makeApiRequest(
        candleDuration,
        '0xada5013122d395ba3c54772283fb069b10426056ef8ca54750cb9bb552a59e7d',
        1635779700,
      );
      console.log('DATA');
      console.log(data);
      let bars: Bar[] = [];
      if (data) {
        bars = data;
      } else {
        bars = [];
      }

      if (!bars.length) {
        onHistoryCallback([], {
          noData: true,
        });
        return;
      }
      const lastBar = lastBarCache.get(symbolInfo.name);
      const newestBar = bars[bars.length - 1];
      if (lastBar) {
        if (newestBar.time >= lastBar.time) {
          lastBarCache.set(symbolInfo.name, newestBar);
        }
      } else {
        lastBarCache.set(symbolInfo.name, newestBar);
      }
      onHistoryCallback(bars, {
        noData: false,
      });
    } catch (error) {
      onErrorCallback(error);
    }
  },
  // https://github.com/tradingview/charting_library/wiki/JS-Api/f62fddae9ad1923b9f4c97dbbde1e62ff437b924#calculatehistorydepthresolution-resolutionback-intervalback
  calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
    if (resolutionBack === 'D') {
      if (resolution > MAX_DAYS)
        return { resolutionBack: 'D', intervalBack: MAX_DAYS };
    } else if (resolutionBack === 'M') {
      if (resolution > MAX_MONTHS)
        return { resolutionBack: 'M', intervalBack: MAX_MONTHS };
    }
  },
  // https://github.com/tradingview/charting_library/wiki/JS-Api/f62fddae9ad1923b9f4c97dbbde1e62ff437b924#subscribebarssymbolinfo-resolution-onrealtimecallback-subscriberuid-onresetcacheneededcallback
  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback,
  ) => {
    console.log(
      '[subscribeBars]: Method call with subscribeUID:',
      subscribeUID,
    );
    subscribeOnStream(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscribeUID,
      onResetCacheNeededCallback,
      lastBarCache.get(symbolInfo.full_name),
    );
  },

  // https://github.com/tradingview/charting_library/wiki/JS-Api/f62fddae9ad1923b9f4c97dbbde1e62ff437b924#unsubscribebarssubscriberuid
  unsubscribeBars: subscriberUID => {
    console.log(
      '[unsubscribeBars]: Method call with subscriberUID:',
      subscriberUID,
    );
    unsubscribeFromStream(subscriberUID);
  },
};

export default tradingChartDataFeeds;
