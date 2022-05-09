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
import { Bar, fetchCandleSticks } from './graph';

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
  private abortControllerSource: AbortController | null = null;

  private onUpdate(subscriptionItem: SubItem) {
    console.log('on update?', subscriptionItem);

    if (!subscriptionItem?.symbolInfo?.name) {
      console.log('error in symbol info', subscriptionItem);
      return;
    }

    if (typeof document?.hasFocus === 'function' && !document.hasFocus()) {
      console.log(
        typeof document?.hasFocus === 'function',
        !document.hasFocus(),
      );
      return;
    }
    if (this.abortControllerSource) this.abortControllerSource.abort();
    this.abortControllerSource = new AbortController();

    const assets = subscriptionItem.symbolInfo.name.split('/');

    console.log(
      assets,
      new Date(
        Math.ceil(subscriptionItem?.lastBar?.time || Date.now()),
      ).toString(),
    );

    fetchCandleSticks(
      assets[0],
      assets[1],
      'interval',
      Math.ceil((subscriptionItem?.lastBar?.time || Date.now()) / 1000),
      Math.ceil(Date.now() / 1000),
      this.abortControllerSource.signal,
    )
      .then(bars => {
        console.log('update result', bars);

        bars.forEach(item => {
          let bar;
          if (
            !subscriptionItem.lastBar ||
            item.time > subscriptionItem.lastBar.time
          ) {
            console.log('dd', item.time, subscriptionItem.lastBar.time);
            // generate new bar
            bar = {
              ...item,
              time: item.time,
            };
          } else if (
            subscriptionItem.lastBar &&
            item.time === subscriptionItem.lastBar.time
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
      })
      .catch(console.error);
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
