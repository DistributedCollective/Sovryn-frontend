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
import { Bar } from './helpers';
import {
  subscription as bscSubscription,
  decodeLogs,
} from '../../utils/bscWebsocket';
import { symbolMap } from './helpers';

// const WebSocket = require('ws');
const url = 'ws://localhost:8080';

// TODO: Change subscription ID to perpID + candleDuration

// TODO: move to config
const address = '0xB59bdf071508B8D1f4Bb76f18CAB01eA96E1Fa4E'.toLowerCase();
const tradeTopic =
  '0x07e349dbc09d1f39e3df0bcb7c5cac53d0020e2da13badb5cd6fa4450801a7f7';

// const subscription = bscSubscription(address, [tradeTopic], 13762379);
const subscription = new WebSocket(url);

type SubItem = {
  symbolInfo: any;
  subscribeUID: string; //e.g. perpId_M_10
  resolution: string;
  lastBar: Bar;
  // subHandlers: Function[];
  subHandlers: {
    id: string;
    callback: Function;
  }[];
};

const channelToSubscription = new Map<string, SubItem>();

function getNextDailyBarTime(barTime) {
  /** TODO: Change this to not be hardcoded as daily */
  const date = new Date(barTime * 1000);
  date.setDate(date.getDate() + 1);
  return date.getTime() / 1000;
}

subscription.onopen = () => {
  console.log('web3 socket for perp swaps is connected');
};

subscription.onmessage = message => {
  console.log(message);
  const data = JSON.parse(message.data);
  const decoded = decodeLogs(data.data, [data.topics[1]]);
  console.log('[socket] Message:', decoded);
  const tradePrice = parseFloat(weiTo2(decoded.price));
  const tradeTime = new Date().getTime(); //parseInt(decoded.blockTimestamp);
  const channelString = Object.keys(symbolMap).find(
    item => symbolMap[item].toLowerCase() === decoded.perpetualId.toLowerCase(),
  );
  try {
    if (channelString) {
      const subscriptionItem = channelToSubscription.get(channelString);
      console.log('[socket] Subscription item', subscriptionItem);
      if (subscriptionItem === undefined || !subscriptionItem.lastBar) {
        return;
      }
      const lastBar = subscriptionItem.lastBar;
      const nextDailyBarTime = getNextDailyBarTime(lastBar.time);
      let bar;
      if (tradeTime >= nextDailyBarTime) {
        bar = {
          ...lastBar,
          open: lastBar.close,
          high: Math.max(lastBar.close, tradePrice),
          low: Math.min(lastBar.close, tradePrice),
          close: tradePrice,
          time: new Date().getTime(),
        };
        console.log('[socket] Generate new bar', bar);
      } else {
        bar = {
          ...lastBar,
          high: Math.max(lastBar.high, tradePrice),
          low: Math.min(lastBar.low, tradePrice),
          close: tradePrice,
        };
      }
      console.log('[socket] Update the latest bar by price', tradePrice);
      subscriptionItem.lastBar = bar;

      // send data to every subscriber of that symbol
      console.log('[socket] New subscriptionItem', subscriptionItem);
      subscriptionItem.subHandlers.forEach(handler => handler.callback(bar));
    }
  } catch (e) {
    console.error(e);
  }
};
// subscription.on('changed', changed => console.log(changed));
subscription.onerror = err => {
  console.error(err);
};

export function subscribeOnStream(
  symbolInfo,
  resolution,
  onRealtimeCallback,
  subscribeUID,
  onResetCacheNeededCallback,
  lastBar,
) {
  console.log('subscribe on stream placeholder');
  console.log('[subscribe]: Last Daily Bar', lastBar);
  const channelString = symbolInfo.name;
  const handler = {
    id: subscribeUID,
    callback: onRealtimeCallback,
  };
  let subscriptionItem = channelToSubscription.get(channelString);
  if (subscriptionItem) {
    // already subscribed to the channel, use the existing subscription
    subscriptionItem.subHandlers.push(handler);
    return;
  }
  subscriptionItem = {
    symbolInfo: symbolInfo,
    subscribeUID: subscribeUID,
    resolution: resolution,
    lastBar: lastBar,
    subHandlers: [handler],
  };
  console.log('[subscribeBars]: subItem', subscriptionItem);
  channelToSubscription.set(channelString, subscriptionItem);
  console.log(
    '[subscribeBars]: channelToSubscription after add',
    channelToSubscription.entries(),
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
      handlerIndex = subscriptionItem.subHandlers.findIndex(
        handler => handler.id === subscriberUID,
      );
    }

    if (subscriptionItem && handlerIndex !== -1) {
      // remove from subHandlers
      subscriptionItem.subHandlers.splice(handlerIndex, 1);

      if (subscriptionItem.subHandlers.length === 0) {
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
