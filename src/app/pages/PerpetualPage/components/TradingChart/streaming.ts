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
import axios, { CancelTokenSource } from 'axios';

import { Bar } from './datafeed';

type SubItem = {
  symbolInfo: any;
  subscribeUID: string; //e.g. SOV/USDT_10
  resolution: string;
  lastBar: Bar;
  handler: Function;
  timer?: number;
};

const REFRESH_RATE = 15 * 1e3;

export class Streaming {
  private subscriptions = new Map<string, SubItem>();
  private cancelTokenSource: CancelTokenSource | null = null;

  private onUpdate(subscriptionItem: SubItem) {
    if (!subscriptionItem?.symbolInfo?.name) {
      console.log('error in symbol info', subscriptionItem);
      return;
    }

    if (typeof document?.hasFocus === 'function' && !document.hasFocus())
      return;
    if (this.cancelTokenSource) this.cancelTokenSource.cancel();
    this.cancelTokenSource = axios.CancelToken.source();
    axios
      .get(`${subscriptionItem.symbolInfo.name.replace('/', ':')}`, {
        cancelToken: this.cancelTokenSource.token,
        params: {
          startTime: subscriptionItem?.lastBar?.time || Date.now(),
        },
      })
      .then(response => {
        if (
          response.data &&
          response.data.series &&
          response.data.series.length > 0
        ) {
          response.data.series.forEach(item => {
            let bar;
            if (
              !subscriptionItem.lastBar ||
              item.time * 1e3 > subscriptionItem.lastBar.time
            ) {
              // generate new bar
              bar = {
                ...item,
                time: item.time * 1e3,
              };
            } else if (
              subscriptionItem.lastBar &&
              item.time * 1e3 === subscriptionItem.lastBar.time
            ) {
              // update last bar
              bar = {
                ...subscriptionItem.lastBar,
                high: Math.max(subscriptionItem.lastBar.high, item.high),
                low: Math.min(subscriptionItem.lastBar.low, item.low),
                close: item.close,
              };
            }
            // update last bar cache and execute chart callback
            subscriptionItem.lastBar = bar;
            subscriptionItem.handler(bar);
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
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
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback,
    lastBar,
  ) {
    let subscriptionItem = this.subscriptions.get(subscribeUID);
    if (subscriptionItem) {
      // already subscribed to the channel, continue to use the existing subscription
      console.log(`already subscribed to`, subscriptionItem);
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
