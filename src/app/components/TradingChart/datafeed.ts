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
import { Bar, fetchCandleSticks } from './graph';
import { stream } from './streaming';

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
      pricescale: symbolName.split('/')[1]?.match(/USDT|DOC/) ? 100 : 100000000,
      has_intraday: true,
      intraday_multipliers: ['10'],
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
    var split_symbol = symbolInfo.name.split('/');
    try {
      const bars = await fetchCandleSticks(
        split_symbol[0],
        split_symbol[1],
        resolution,
        from,
        to,
      );

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
    stream.subscribeOnStream(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscribeUID,
      onResetCacheNeededCallback,
      lastBarCache.get(symbolInfo.name),
    );
  },

  // https://github.com/tradingview/charting_library/wiki/JS-Api/f62fddae9ad1923b9f4c97dbbde1e62ff437b924#unsubscribebarssubscriberuid
  unsubscribeBars: subscriberUID => {
    stream.unsubscribeFromStream(subscriberUID);
  },
};

export default tradingChartDataFeeds;
