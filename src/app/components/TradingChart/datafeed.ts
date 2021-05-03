/**
 * TradingChart Datafeed
 *
 * Implementation of TradingView Charting Library JS API:
 * https://github.com/tradingview/charting_library/wiki/JS-Api
 *
 * If the version of the library is updated, then modifications may
 * be necessary to this file and the realtime streaming.ts file in
 * this directory. Refer to:
 * https://github.com/tradingview/charting_library/wiki/Breaking-Changes
 */
import { backendUrl, currentChainId } from 'utils/classifiers';
import { stream } from './streaming';

export const api_root = `${backendUrl[currentChainId]}/datafeed/price/`;
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
const lastBarCache = new Map<string, Bar>();

// Supported configuration options can be found here:
// https://github.com/tradingview/charting_library/wiki/JS-Api#onreadycallback
const config = {
  exchanges: [],
  symbols_types: [],
  supported_resolutions: supportedResolutions,
  supports_time: false,
};

const makeApiRequest = async path => {
  try {
    const response = await fetch(`${api_root}${path}`);
    return response.json();
  } catch (error) {
    throw new Error(`Request error: ${error.status}`);
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

/**
 * JS API Datafeed implementation
 */
export default {
  // https://github.com/tradingview/charting_library/wiki/JS-Api#onreadycallback
  onReady: callback => {
    setTimeout(() => callback(config));
  },

  //https://github.com/tradingview/charting_library/wiki/JS-Api#searchsymbolsuserinput-exchange-symboltype-onresultreadycallback
  searchSymbols: async (
    userInput,
    exchange,
    symbolType,
    onResultReadyCallback,
  ) => {
    // disabled via chart config in index.tsx
  },

  //https://github.com/tradingview/charting_library/wiki/JS-Api#resolvesymbolsymbolname-onsymbolresolvedcallback-onresolveerrorcallback-extension
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
      pricescale: symbolName.split('/')[1].match(/USDT|DOC/) ? 100 : 100000000,
      has_intraday: true,
      intraday_multipliers: ['10'],
      supported_resolution: supportedResolutions,
      has_no_volume: true,
      has_empty_bars: true,
      has_daily: false,
      has_weekly_and_monthly: false,
      data_status: 'streaming',
    };

    // if (!symbolItem) {
    //   console.log('[resolveSymbol]: Cannot resolve symbol', symbolName);
    //   onResolveErrorCallback('cannot resolve symbol');
    //   return;
    // }

    setTimeout(() => onSymbolResolvedCallback(symbolInfo));
  },

  //https://github.com/tradingview/charting_library/wiki/JS-Api#getbarssymbolinfo-resolution-periodparams-onhistorycallback-onerrorcallback
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
    const url = split_symbol[0] + ':' + split_symbol[1];
    const urlParameters = {
      startTime: from * 1e3,
      endTime: to * 1e3,
      // limit: 600,
    };
    const query = Object.keys(urlParameters)
      .map(name => `${name}=${encodeURIComponent(urlParameters[name])}`)
      .join('&');
    try {
      const data = await makeApiRequest(`${url}?${query}`);
      let bars: Bar[] = [];
      if (data && data.series) {
        data.series.forEach(bar => {
          if (bar.time >= from && bar.time <= to) {
            bars = [
              ...bars,
              {
                time: bar.time * 1e3,
                low: bar.low,
                high: bar.high,
                open: bar.open,
                close: bar.close,
                //volume: bar.volume
              },
            ];
          }
        });
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

  //https://github.com/tradingview/charting_library/wiki/JS-Api#subscribebarssymbolinfo-resolution-onrealtimecallback-subscriberuid-onresetcacheneededcallback
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

  //https://github.com/tradingview/charting_library/wiki/JS-Api#unsubscribebarssubscriberuid
  unsubscribeBars: subscriberUID => {
    stream.unsubscribeFromStream(subscriberUID);
  },
};
