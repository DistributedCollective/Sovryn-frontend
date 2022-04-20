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
import {
  CandleDuration,
  CandleDictionary,
} from '../../hooks/graphql/useGetCandles';
import {
  Bar,
  config,
  supportedResolutions,
  resolutionMap,
  symbolMap,
  makeApiRequest,
} from './helpers';
import { ApolloClient } from '@apollo/client';
import {
  ChartingLibraryWidgetOptions,
  SearchSymbolsCallback,
  LibrarySymbolInfo,
} from '@sovryn/charting-library/src/charting_library/charting_library.min';

const lastBarsCache = new Map<string, Bar>();

const tradingChartDataFeeds = (
  graphqlClient: ApolloClient<any>,
): ChartingLibraryWidgetOptions['datafeed'] => ({
  // https://github.com/tradingview/charting_library/wiki/JS-Api/f62fddae9ad1923b9f4c97dbbde1e62ff437b924#onreadycallback
  onReady: callback => setTimeout(() => callback(config)),

  // https://github.com/tradingview/charting_library/wiki/JS-Api/f62fddae9ad1923b9f4c97dbbde1e62ff437b924#searchsymbolsuserinput-exchange-symboltype-onresultreadycallback
  // searchSymbols disabled via chart config in index.tsx
  searchSymbols: (
    userInput: string,
    exchange: string,
    symbolType: string,
    onResult: SearchSymbolsCallback,
  ) => {},

  // https://github.com/tradingview/charting_library/wiki/JS-Api/f62fddae9ad1923b9f4c97dbbde1e62ff437b924#resolvesymbolsymbolname-onsymbolresolvedcallback-onresolveerrorcallback-extension
  resolveSymbol: async (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback,
  ) => {
    const symbolInfo: LibrarySymbolInfo = {
      name: symbolName,
      full_name: symbolName,
      description: '',
      type: 'crypto',
      exchange: '',
      listed_exchange: '',
      format: 'price',
      session: '24x7',
      timezone: 'Etc/UTC',
      ticker: symbolName,
      minmov: 1, //0.00000001,
      pricescale: 100,
      has_intraday: true,
      intraday_multipliers: ['1', '15', '60', '240'],
      supported_resolutions: supportedResolutions,
      has_no_volume: false,
      has_empty_bars: false,
      has_daily: true,
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
    const startTime = (): number => {
      const lastBarTime = lastBarsCache.get(symbolInfo.name)?.time;
      if (firstDataRequest) {
        return from;
      } else if (lastBarTime !== undefined) {
        return lastBarTime / 1e3;
      } else {
        return new Date().getTime() / 1e3;
      }
    };
    const candleNumber = (): number => {
      const resolutionNumber = parseInt(resolution);
      const candleSize = resolutionNumber > 0 ? resolutionNumber : 1440; //Resolution in minutes - if more than a day, use day
      const timeSpanSeconds = to - from;
      const numOfCandles = Math.ceil(timeSpanSeconds / (candleSize * 60));
      return numOfCandles;
    };
    const candleDuration: CandleDuration = resolutionMap[resolution];
    try {
      /** If first request then calculate number of bars and pass it in, else startTime */
      const data = await makeApiRequest(
        graphqlClient,
        candleDuration,
        symbolMap[symbolInfo.name],
        startTime(),
        candleNumber(),
        firstDataRequest,
      );
      let bars: Bar[] = [];
      if (data.length > 0) {
        bars = data;
      } else {
        bars = [];
      }

      if (firstDataRequest) {
        lastBarsCache.set(symbolInfo.name, { ...bars[bars.length - 1] });
      }

      if (!bars || bars.length === 1) {
        onHistoryCallback([], {
          noData: true,
        });
        return;
      }

      const lastBar = lastBarsCache.get(symbolInfo.name);
      const newestBar = bars[bars.length - 1];
      try {
        if (lastBar) {
          if (newestBar && newestBar.time >= lastBar.time) {
            lastBarsCache.set(symbolInfo.name, newestBar);
          }
        } else {
          lastBarsCache.set(symbolInfo.name, newestBar);
        }
      } catch (error) {
        console.error('Errors caching newest bar as last bar', error);
      }

      if (!bars || bars.length === 0) {
        onHistoryCallback([], {
          noData: true,
        });
      } else {
        onHistoryCallback(bars, {
          noData: false,
        });
      }
    } catch (error) {
      onErrorCallback(error);
    }
  },
  // https://github.com/tradingview/charting_library/wiki/JS-Api/f62fddae9ad1923b9f4c97dbbde1e62ff437b924#calculatehistorydepthresolution-resolutionback-intervalback
  calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
    const candleDetails = CandleDictionary.get(resolutionMap[resolution]);
    return {
      resolutionBack: candleDetails.resolutionBack,
      intervalBack: candleDetails.intervalBack,
    };
  },
  // https://github.com/tradingview/charting_library/wiki/JS-Api/f62fddae9ad1923b9f4c97dbbde1e62ff437b924#subscribebarssymbolinfo-resolution-onrealtimecallback-subscriberuid-onresetcacheneededcallback
  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback,
  ) => {
    const lastBar = lastBarsCache.get(symbolInfo.name);
    subscribeOnStream(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscribeUID,
      onResetCacheNeededCallback,
      lastBar,
    );
  },

  // // // https://github.com/tradingview/charting_library/wiki/JS-Api/f62fddae9ad1923b9f4c97dbbde1e62ff437b924#unsubscribebarssubscriberuid
  unsubscribeBars: subscriberUID => unsubscribeFromStream(subscriberUID),
});

export default tradingChartDataFeeds;
