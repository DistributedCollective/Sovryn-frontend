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

import { weiTo2 } from 'utils/blockchain/math-helpers';
import { Bar } from './datafeed';
import {
  subscription as bscSubscription,
  decodeLogs,
} from '../../utils/bscWebsocket';

// TODO: Change subscription ID to perpID + candleDuration

// TODO: move to config
const address = '0x307c2d3d8ac397c58ba86b3806bcb9465968be34'.toLowerCase();
const tradeTopic =
  '0x07e349dbc09d1f39e3df0bcb7c5cac53d0020e2da13badb5cd6fa4450801a7f7';

const subscription = bscSubscription(address, [tradeTopic], 13556506);

type SubItem = {
  symbolInfo: any;
  subscribeUID: string; //e.g. perpId_M_10
  resolution: string;
  lastDailyBar: Bar;
  handlers: {
    id: string;
    callback: Function;
  }[];
  timer?: number;
};

const channelToSubscription = new Map<string, SubItem>();

function getNextDailyBarTime(barTime) {
  /** TODO: Change this to not be hardcoded as daily */
  const date = new Date(barTime * 1000);
  date.setDate(date.getDate() + 1);
  return date.getTime() / 1000;
}

subscription.on('connected', () => {
  console.log('web3 socket for perp swaps is connected');
});
subscription.on('data', data => {
  /** Decode logs and add to database */
  const decoded = decodeLogs(data.data, [data.topics[1]]);
  console.log('[socket] Message:', decoded);
  const tradePrice = parseFloat(weiTo2(decoded.price));
  const tradeTime = parseInt(decoded.blockTimestamp);
  const channelString = decoded.perpetualId;
  const subscriptionItem = channelToSubscription.get(channelString);
  if (subscriptionItem === undefined) {
    return;
  }
  const lastDailyBar = subscriptionItem.lastDailyBar;
  const nextDailyBarTime = getNextDailyBarTime(lastDailyBar.time);
  let bar;
  if (tradeTime >= nextDailyBarTime) {
    bar = {
      ...lastDailyBar,
      high: Math.max(lastDailyBar.high, tradePrice),
      low: Math.min(lastDailyBar.low, tradePrice),
      close: tradePrice,
    };
    console.log('[socket] Generate new bar', bar);
  }
  console.log('[socket] Update the latest bar by price', tradePrice);
  subscriptionItem.lastDailyBar = bar;

  // send data to every subscriber of that symbol
  subscriptionItem.handlers.forEach(handler => handler.callback(bar));
});
subscription.on('changed', changed => console.log(changed));
subscription.on('error', err => {
  console.error(err);
});

export function subscribeOnStream(
  symbolInfo,
  resolution,
  onRealtimeCallback,
  subscribeUID,
  onResetCacheNeededCallback,
  lastDailyBar,
) {
  console.log('subscribe on stream placeholder');
  const channelString = symbolInfo.name;
  const handler = {
    id: subscribeUID,
    callback: onRealtimeCallback,
  };
  let subscriptionItem = channelToSubscription.get(channelString);
  if (subscriptionItem) {
    // already subscribed to the channel, use the existing subscription
    subscriptionItem.handlers.push(handler);
    return;
  }
  subscriptionItem = {
    symbolInfo,
    subscribeUID,
    resolution,
    lastDailyBar,
    handlers: [handler],
  };
  channelToSubscription.set(channelString, subscriptionItem);
  console.log(
    '[subscribeBars]: Subscribe to streaming. Channel:',
    channelString,
  );
}

export function unsubscribeFromStream(subscriberUID) {
  // find a subscription with id === subscriberUID
  console.log('unsubscribe from stream placeholder');
  for (const index in channelToSubscription.keys()) {
    const channelString = channelToSubscription.keys()[index];
    const subscriptionItem = channelToSubscription.get(channelString);
    let handlerIndex;
    if (subscriptionItem) {
      handlerIndex = subscriptionItem.handlers.findIndex(
        handler => handler.id === subscriberUID,
      );
    }

    if (subscriptionItem && handlerIndex !== -1) {
      // remove from handlers
      subscriptionItem.handlers.splice(handlerIndex, 1);

      if (subscriptionItem.handlers.length === 0) {
        // unsubscribe from the channel, if it was the last handler
        console.log(
          '[unsubscribeBars]: Unsubscribe from streaming. Channel:',
          channelString,
        );
        channelToSubscription.delete(channelString);
        break;
      }
    }
  }
}
