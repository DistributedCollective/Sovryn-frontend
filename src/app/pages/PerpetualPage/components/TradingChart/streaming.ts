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
  decodeTradeLogs,
} from '../../utils/bscWebsocket';
import { symbolMap } from './helpers';
import { getContract } from 'utils/blockchain/contract-helpers';

// const WebSocket = require('ws');
// const url = 'ws://localhost:8080';

const address = getContract('perpetualManager').address.toLowerCase();
const subscription = bscSubscription(address, ['Trade']);
// const subscription = new WebSocket(url);

type SubItem = {
  symbolInfo: any;
  subscribeUID: string;
  resolution: string;
  lastBar: Bar;
  subHandlers: {
    id: string;
    callback: Function;
  }[];
};

const channelToSubscription = new Map<string, SubItem>();

function getNextBarTime(barTime: number, resolution: number) {
  return barTime + resolution * 60;
}

subscription.on('connected', () => {
  console.log('web3 socket for perp swaps is connected');
});

subscription.on('data', data => {
  const decoded = decodeTradeLogs(data.data, [data.topics[1]]);
  console.log('[socket] Message:', decoded);
  const tradePrice = parseFloat(weiTo2(decoded.price));
  const tradeTime = parseInt(decoded.blockTimestamp) * 1e3;
  const channelString = Object.keys(symbolMap).find(
    item => symbolMap[item].toLowerCase() === decoded.perpetualId.toLowerCase(),
  );
  try {
    if (channelString) {
      const subscriptionItem = channelToSubscription.get(channelString);
      console.debug('[socket] Subscription item', subscriptionItem);
      if (subscriptionItem === undefined || !subscriptionItem.lastBar) {
        return;
      }
      const lastBar = subscriptionItem.lastBar;
      const nextBarTime = getNextBarTime(
        lastBar.time,
        parseInt(subscriptionItem.resolution),
      );
      let bar;
      if (tradeTime >= nextBarTime) {
        bar = {
          ...lastBar,
          open: lastBar.close,
          high: Math.max(lastBar.close, tradePrice),
          low: Math.min(lastBar.close, tradePrice),
          close: tradePrice,
          volume: Math.abs(parseFloat(weiTo2(decoded.tradeAmount))),
          time: new Date().getTime(),
        };
        console.debug('[socket] Generate new bar', bar);
      } else {
        bar = {
          ...lastBar,
          high: Math.max(lastBar.high, tradePrice),
          low: Math.min(lastBar.low, tradePrice),
          close: tradePrice,
          volume: lastBar.volume
            ? lastBar.volume + Math.abs(parseFloat(weiTo2(decoded.tradeAmount)))
            : Math.abs(parseFloat(weiTo2(decoded.tradeAmount))),
        };
      }
      console.log('[socket] Update the latest bar by price', tradePrice);
      subscriptionItem.lastBar = bar;

      // send data to every subscriber of that symbol
      // console.log('[socket] New subscriptionItem', subscriptionItem);

      subscriptionItem.subHandlers.forEach(handler => {
        try {
          handler.callback(bar);
        } catch (e) {
          // const error = e as Error;
          // // This is a false positive due to using has_empty_bars. Not 100% sure about this, so if there are issues, this may be why
          // if (error.message.includes('time order violation')) {
          //   return;
          // }
          throw e;
        }
      });
    }
  } catch (e) {
    console.error(e);
  }
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
  console.debug('[subscribeBars]: subItem', subscriptionItem);
  channelToSubscription.set(channelString, subscriptionItem);
  console.debug(
    '[subscribeBars]: channelToSubscription after add',
    channelToSubscription.entries(),
  );
}

export function unsubscribeFromStream(subscriberUID) {
  // find a subscription with id === subscriberUID
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
