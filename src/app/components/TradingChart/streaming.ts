/**
 * TradingChart "realtime" data stream.
 *
 * Implementation of TradingView Charting Library (v18.043) subscribeBars() and unsubscribeBars():
 * https://github.com/tradingview/charting_library/wiki/JS-Api/f62fddae9ad1923b9f4c97dbbde1e62ff437b924#subscribebarssymbolinfo-resolution-onrealtimecallback-subscriberuid-onresetcacheneededcallback
 *
 * If the version of the library is updated, then modifications may
 * be necessary to this file and the datafeed.ts file in
 * this directory. Refer to:
 * https://github.com/tradingview/charting_library/wiki/Breaking-Changes
 */
import { ApolloClient } from '@apollo/client';
import { resolutionMap } from 'app/pages/PerpetualPage/components/TradingChart/helpers';
import { CandleDuration } from 'app/pages/PerpetualPage/hooks/graphql/useGetCandles';
import { debug } from 'utils/debug';
import { pushPrice } from 'utils/pair-price-tracker';
import { TradingCandleDictionary } from './dictionary';
import {
  Bar,
  getTokensFromSymbol,
  hasDirectFeed,
  queryPairByChunks,
} from './helpers';

type SubItem = {
  symbolInfo: any;
  subscribeUID: string; //e.g. SOV/USDT_10
  resolution: string;
  lastBar: Bar;
  handler: Function;
  timer?: number;
};

const REFRESH_RATE = 15 * 1e3;

const log = debug('chart.streaming');

export class Streaming {
  private client: ApolloClient<any> | null = null;
  private subscriptions = new Map<string, SubItem>();

  private onUpdate(subscriptionItem: SubItem) {
    if (!subscriptionItem?.symbolInfo?.name) {
      log.error('error in symbol info', subscriptionItem);
      return;
    }

    const candleDuration: CandleDuration =
      resolutionMap[subscriptionItem.resolution];

    const details = TradingCandleDictionary.get(candleDuration);

    const { baseToken, quoteToken } = getTokensFromSymbol(
      subscriptionItem.symbolInfo.name,
    );

    queryPairByChunks(
      this.client!,
      details,
      baseToken,
      quoteToken,
      subscriptionItem?.lastBar?.time / 1000,
      Math.ceil(Date.now() / 1000),
      hasDirectFeed(subscriptionItem?.symbolInfo?.name),
      1,
      true,
    )
      .then(bars => {
        bars.reverse().forEach((item, index) => {
          let bar;
          if (
            !subscriptionItem.lastBar ||
            item.time > subscriptionItem?.lastBar?.time
          ) {
            // generate new bar
            bar = {
              ...item,
              time: item.time,
            };
          } else if (
            subscriptionItem.lastBar &&
            item.time === subscriptionItem?.lastBar?.time
          ) {
            // update last bar
            bar = {
              ...subscriptionItem.lastBar,
              high: Math.max(subscriptionItem.lastBar.high, item.high),
              low: Math.min(subscriptionItem.lastBar.low, item.low),
              close: item.close,
            };
            pushPrice(`${baseToken}/${quoteToken}`, bar.close);
          } else {
            // do not update
            return;
          }

          // update last bar cache and execute chart callback
          subscriptionItem.lastBar = bar;
          subscriptionItem.handler(bar);
        });
      })
      .catch(log.error);
  }

  private addSubscription(subItem) {
    subItem.timer = setInterval(() => this.onUpdate(subItem), REFRESH_RATE);
    this.subscriptions.set(subItem.subscribeUID, subItem);
  }

  private clearSubscription(subscribeUID) {
    const currentSub = this.subscriptions.get(subscribeUID);
    if (!currentSub) return;
    clearInterval(currentSub.timer);
    delete currentSub.timer;
    this.subscriptions.delete(subscribeUID);
  }

  public subscribeOnStream(
    client: ApolloClient<any>,
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback,
    lastBar,
  ) {
    this.client = client;

    let subscriptionItem = this.subscriptions.get(subscribeUID);
    if (subscriptionItem) {
      // already subscribed to the channel, continue to use the existing subscription
      log.error(`already subscribed to`, subscriptionItem);
      return;
    }

    subscriptionItem = {
      symbolInfo,
      subscribeUID,
      resolution,
      lastBar,
      handler: onRealtimeCallback,
    };
    this.addSubscription(subscriptionItem);
  }

  public unsubscribeFromStream(subscriberUID) {
    this.clearSubscription(subscriberUID);
  }
}

export const stream = new Streaming();
