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

import { stream } from './streaming';
import { ApolloClient } from '@apollo/client';
import {
  ChartingLibraryWidgetOptions,
  SearchSymbolsCallback,
  LibrarySymbolInfo,
} from '@sovryn/charting-library/src/charting_library/charting_library.min';
import {
  Bar,
  config,
  resolutionMap,
  supportedResolutions,
} from 'app/pages/PerpetualPage/components/TradingChart/helpers';
import {
  getTokensFromSymbol,
  hasDirectFeed,
  queryPairByChunks,
} from './helpers';
import { CandleDuration } from 'app/pages/PerpetualPage/hooks/graphql/useGetCandles';
import { TradingCandleDictionary } from './dictionary';
import { Asset } from 'types';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';

const newestBarsCache = new Map<string, Bar>();
const oldestBarsCache = new Map<string, Bar>();

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
    const [, quote] = symbolName.split('/') as [Asset, Asset];
    const asset = AssetsDictionary.get(quote);

    const symbolInfo: LibrarySymbolInfo = {
      name: symbolName,
      full_name: symbolName,
      description: '',
      type: 'crypto',
      exchange: '',
      listed_exchange: '',
      format: 'price',
      volume_precision: 6,
      session: '24x7',
      timezone: 'Etc/UTC',
      ticker: symbolName,
      minmov: 1,
      pricescale: 10 ** asset.displayDecimals,
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
    const candleDuration: CandleDuration = resolutionMap[resolution];
    const candleDetails = TradingCandleDictionary.get(candleDuration);

    const fromTime = (): number => {
      const oldestBarTime = oldestBarsCache.get(symbolInfo.name)?.time;
      if (firstDataRequest) {
        return from;
      } else if (oldestBarTime !== undefined) {
        if (from < oldestBarTime / 1e3) {
          return from;
        }
        return oldestBarTime / 1e3 - candleDetails.candleSeconds;
      } else {
        return from;
      }
    };

    try {
      const { baseToken, quoteToken } = getTokensFromSymbol(symbolInfo.name);

      const items = await queryPairByChunks(
        graphqlClient,
        candleDetails,
        baseToken,
        quoteToken,
        fromTime(),
        to,
        hasDirectFeed(symbolInfo.name),
      );

      if (!items || items.length === 0) {
        onHistoryCallback([], {
          noData: true,
        });
        return;
      }

      if (firstDataRequest) {
        newestBarsCache.set(symbolInfo.name, { ...items[items.length - 1] });
        oldestBarsCache.set(symbolInfo.name, { ...items[0] });
      }

      const lastBar = newestBarsCache.get(symbolInfo.name);
      const newestBar = items[items.length - 1];
      try {
        if (lastBar) {
          if (newestBar && newestBar?.time < lastBar.time) {
            newestBarsCache.set(symbolInfo.name, newestBar);
          }
        } else {
          newestBarsCache.set(symbolInfo.name, newestBar);
        }
      } catch (error) {
        console.error('Errors caching newest bar as last bar', error);
      }

      const oldestBar = oldestBarsCache.get(symbolInfo.name);
      const currentOldest = items[0];

      if (oldestBar) {
        if (oldestBar.time > currentOldest.time) {
          oldestBarsCache.set(symbolInfo.name, currentOldest);
        }
      } else {
        oldestBarsCache.set(symbolInfo.name, currentOldest);
      }

      onHistoryCallback(items, {
        noData: false,
      });
    } catch (error) {
      onErrorCallback(error);
    }
  },
  // https://github.com/tradingview/charting_library/wiki/JS-Api/f62fddae9ad1923b9f4c97dbbde1e62ff437b924#calculatehistorydepthresolution-resolutionback-intervalback
  calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
    const candleDetails = TradingCandleDictionary.get(
      resolutionMap[resolution],
    );
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
    const newestBar = newestBarsCache.get(symbolInfo.name);
    stream.subscribeOnStream(
      graphqlClient,
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscribeUID,
      onResetCacheNeededCallback,
      newestBar,
    );
  },

  // https://github.com/tradingview/charting_library/wiki/JS-Api/f62fddae9ad1923b9f4c97dbbde1e62ff437b924#unsubscribebarssubscriberuid
  unsubscribeBars: subscriberUID => stream.unsubscribeFromStream(subscriberUID),
});

export default tradingChartDataFeeds;
