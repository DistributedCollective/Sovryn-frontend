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
import { backendUrl, currentChainId } from 'utils/classifiers';
import { stream } from './streaming';

export type Bar = {
  time: number;
  low: number;
  high: number;
  open: number;
  close: number;
  volume?: number;
};

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
const MAX_DAYS = 5;
const MAX_MONTHS = 1;
/**
 * Number of 10 minute candles that can be loaded in one chunk from the backend endpoint.
 * NOTE: this must be lower or equal to the limit set on backend
 */
const MAX_CANDLES = 4000;
const CANDLE_SIZE_SECONDS = 600; //10 minute candles
const lastBarCache = new Map<string, Bar>();

// Supported configuration options can be found here:
// https://github.com/tradingview/charting_library/wiki/JS-Api/f62fddae9ad1923b9f4c97dbbde1e62ff437b924#onreadycallback
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
    throw new Error(`Request error: ${(error as any).status}`);
  }
};

const loadCandleChunk = async (props: {
  oldestCandleTime: number;
  newestCandleTime: number;
  url: string;
  bars: Bar[];
  from: number;
  to: number;
}) => {
  let candleTimes = {
    oldestCandleTime: props.oldestCandleTime,
    newestCandleTime: props.newestCandleTime,
  };
  console.log({
    chunkFrom: new Date(props.oldestCandleTime * 1e3),
    chunkTo: new Date(props.newestCandleTime * 1e3),
  });
  const query = Object.entries({
    startTime: candleTimes.oldestCandleTime * 1e3,
    endTime: candleTimes.newestCandleTime * 1e3,
  })
    .map(item => `${item[0]}=${encodeURIComponent(item[1])}`)
    .join('&');
  const data = await makeApiRequest(`${props.url}?${query}`);
  let newBars: Bar[] = props.bars;
  if (data && data.series) {
    for (let i = data.series.length - 1; i >= 0; i--) {
      let newBar = data.series[i];
      if (newBar && newBars[0] && newBar.time * 1e3 >= newBars[0].time) {
        // console.log('skipping time violation candle', new Date(newBar.time * 1e3), new Date(bars[0].time));
        candleTimes.newestCandleTime = newBar.time;
      } else if (newBar.time >= props.from && newBar.time <= props.to) {
        newBars = [
          {
            time: newBar.time * 1e3,
            low: newBar.low,
            high: newBar.high,
            open: newBar.open,
            close: newBar.close,
          },
          ...newBars,
        ];

        candleTimes.newestCandleTime = Math.min(
          newBar.time,
          candleTimes.oldestCandleTime,
        );
      }
    }
  } else {
    newBars = [];
  }

  return {
    bars: newBars,
    oldestCandleTime: candleTimes.oldestCandleTime,
    newestCandleTime: candleTimes.newestCandleTime,
  };
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
    const url = split_symbol[0] + ':' + split_symbol[1];
    const totalNumCandles = Math.ceil((to - from) / CANDLE_SIZE_SECONDS);
    let bars: Bar[] = [];

    try {
      if (totalNumCandles > MAX_CANDLES) {
        let oldestCandleTime,
          latestCandleTime = to,
          loadedAllCandles = false;
        while (!loadedAllCandles) {
          oldestCandleTime =
            latestCandleTime - MAX_CANDLES * CANDLE_SIZE_SECONDS;
          const {
            bars: newBars,
            oldestCandleTime: newOldestCandleTime,
            newestCandleTime: newLatestCandleTime,
          } = await loadCandleChunk({
            oldestCandleTime,
            newestCandleTime: latestCandleTime,
            url,
            bars,
            from,
            to,
          });
          bars = newBars;
          oldestCandleTime = newOldestCandleTime;
          latestCandleTime = newLatestCandleTime;

          if (latestCandleTime <= from) {
            loadedAllCandles = true;
          }
        }
      } else {
        //total num candles needed is lower than the limit so we can just load all data in one chunk
        const { bars: newBars } = await loadCandleChunk({
          oldestCandleTime: from,
          newestCandleTime: to,
          url,
          bars,
          from,
          to,
        });
        bars = newBars;
      }

      if (!bars.length) {
        onHistoryCallback([], {
          noData: true,
        });
        return;
      }

      const newestBar = bars[bars.length - 1];
      if (newestBar) {
        const lastBar = lastBarCache.get(symbolInfo.name);
        if (lastBar) {
          if (newestBar.time >= lastBar.time) {
            lastBarCache.set(symbolInfo.name, newestBar);
          }
        } else {
          lastBarCache.set(symbolInfo.name, newestBar);
        }
      }

      onHistoryCallback(bars, {
        noData: false,
      });
    } catch (error) {
      console.log('error', error);
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
