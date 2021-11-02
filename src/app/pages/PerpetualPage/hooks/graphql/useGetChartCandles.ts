import { useQuery, gql } from '@apollo/client';
import { DocumentNode } from 'graphql';
import { fromWei } from 'web3-utils';
import {
  supportedResolutions,
  config,
  MAX_DAYS,
  MAX_MONTHS,
  lastBarCache,
} from '../../components/TradingChart/datafeed';
import { stream } from '../../components/TradingChart/streaming';

/**
 * Hook to return candlesticks for chart
 * Takes as input:
 * 1. PerpetualId
 * 2. Candle duration
 * 3. Start time
 *
 * Returns as output:
 * open, high, low, close, volume, startTime
 */

export function useGetCandles(
  candleDuration: CandleDuration,
  perpetualId: string,
  startTime: number,
  endTime?: number,
) {
  console.debug('Getting candles');
  const CANDLE_QUERY = generateCandleQuery(
    candleDuration,
    perpetualId,
    startTime,
  );
  const { data: queryData, loading, error } = useQuery(CANDLE_QUERY);
  let data;

  if (queryData) {
    const candleDataKeys = Object.keys(queryData);
    const newBars = queryData[candleDataKeys[0]].map(bar => {
      return {
        time: bar.periodStartUnix * 1e3,
        low: fromWei(bar.low),
        high: fromWei(bar.high),
        open: fromWei(bar.open),
        close: fromWei(bar.close),
      };
    });
    data = newBars;
  }

  const returnData = {
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
        name: perpetualId,
        description: '',
        type: 'crypto',
        session: '24x7',
        timezone: 'Etc/UTC',
        ticker: perpetualId,
        minmov: 1, //0.00000001,
        pricescale: 100,
        has_intraday: true,
        intraday_multipliers: ['15', '60', '240', '1440'],
        supported_resolution: supportedResolutions,
        has_no_volume: true,
        has_empty_bars: true,
        has_daily: true,
        has_weekly_and_monthly: true,
        data_status: 'streaming',
      };

      setTimeout(() => onSymbolResolvedCallback(symbolInfo));
    },

    // https://github.com/tradingview/charting_library/wiki/JS-Api/f62fddae9ad1923b9f4c97dbbde1e62ff437b924#getbarssymbolinfo-resolution-periodparams-onhistorycallback-onerrorcallback
    getBars: (
      symbolInfo,
      resolution,
      from,
      to,
      onHistoryCallback,
      onErrorCallback,
      firstDataRequest,
    ) => {
      let bars = data;
      console.debug(bars);
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
      return bars;
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

  return { returnData, loading, error };
}

const generateCandleQuery = (
  candleDuration: CandleDuration,
  perpetualId: string,
  startTime: number,
  endTime?: number,
): DocumentNode => {
  const candleDetails = CandleDictionary.get(candleDuration);
  console.debug(candleDetails);
  return gql`
    {
      ${candleDetails.entityName}(
        where: {
          periodStartUnix_gte: ${startTime}
          perpetualId: "${perpetualId}"
        }
        orderBy: periodStartUnix
        orderDirection: desc
        first: 200
      ) {
        perpetualId
        open
        high
        low
        close
        periodStartUnix
      }
    }
  `;
};

export enum CandleDuration {
  M_1 = 'M_1',
  M_15 = 'M_15',
  H_1 = 'H_1',
  H_4 = 'H_4',
  D_1 = 'D_1',
}

class CandleDetails {
  /** TODO: Add default number of candles or default startTime */
  constructor(public entityName: string) {
    this.entityName = entityName;
  }
}

class CandleDictionary {
  public static candles: Map<CandleDuration, CandleDetails> = new Map<
    CandleDuration,
    CandleDetails
  >([
    [CandleDuration.M_1, new CandleDetails('candleSticksMinutes')],
    [CandleDuration.M_15, new CandleDetails('candleSticksFifteenMinutes')],
    [CandleDuration.H_1, new CandleDetails('candleSticksHours')],
    [CandleDuration.H_4, new CandleDetails('candleSticksFourHours')],
    [CandleDuration.D_1, new CandleDetails('candleSticksDays')],
  ]);

  public static get(candle: CandleDuration): CandleDetails {
    return this.candles.get(candle) as CandleDetails;
  }
}
