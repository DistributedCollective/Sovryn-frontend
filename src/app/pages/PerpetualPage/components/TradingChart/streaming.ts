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

import Web3 from 'web3';
import PerpetualManager from 'utils/blockchain/abi/PerpetualManager.json';
import { weiTo2 } from 'utils/blockchain/math-helpers';

const web3Socket = new Web3(
  new Web3.providers.WebsocketProvider(
    'wss://ws-nd-233-405-699.p2pify.com/' + process.env.BSC_WS_TESTNET_API,
  ),
);

const web3Http = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/');

// TODO: move to config
const address = '0x307c2d3d8ac397c58ba86b3806bcb9465968be34'.toLowerCase();
const tradeTopic =
  '0x07e349dbc09d1f39e3df0bcb7c5cac53d0020e2da13badb5cd6fa4450801a7f7';

const jsonInput = PerpetualManager.find(item => item.name === 'Trade')?.inputs;

function decodeLogs(logs: string, topics: string[]): { [key: string]: string } {
  const decoded = web3Http.eth.abi.decodeLog(
    jsonInput != null ? jsonInput : [],
    logs,
    topics,
  );
  return decoded;
}

const subscription = web3Socket.eth.subscribe(
  'logs',
  {
    fromBlock: 13556506,
    address: address,
    topics: [tradeTopic],
  },
  (err, res) => {
    if (!err) console.error(err);
    console.log(res);
  },
);

const channelToSubscription = new Map();

subscription.on('connected', () => {
  console.log('web3 socket for perp swaps is connected');
});
subscription.on('data', data => {
  /** Decode logs and add to database */
  const decoded = decodeLogs(data.data, [data.topics[1]]);
  console.log('[socket] Message:', decoded);
  const parsedEvent = {
    address: data.address,
    blockNumber: data.blockNumber,
    transactionIndex: data.transactionIndex,
    transactionHash: data.transactionHash,
    logIndex: data.logIndex,
    eventData: {
      perpetualId: decoded.perpetualId,
      trader: decoded.trader,
      orderFlags: decoded.orderFlags,
      tradeAmount: decoded.tradeAmount,
      price: decoded.price,
      blockTimestamp: decoded.blockTimestamp,
    },
  };
  const tradePrice = parseFloat(weiTo2(parsedEvent.eventData.price));
  const tradeTime = parsedEvent.eventData.blockTimestamp;
  const channelString = parsedEvent.eventData.perpetualId;
  const subscriptionItem = channelToSubscription.get(channelString);
  if (subscriptionItem === undefined) {
    return;
  }
  const lastDailyBar = subscriptionItem.lastDailyBar;
  let bar = {
    ...lastDailyBar,
    high: Math.max(lastDailyBar.high, tradePrice),
    low: Math.min(lastDailyBar.low, tradePrice),
    close: tradePrice,
  };
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
  const channelString =
    '0xada5013122d395ba3c54772283fb069b10426056ef8ca54750cb9bb552a59e7d';
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
  console.log('SubAdd', { subs: [channelString] });
}

export function unsubscribeFromStream(subscriberUID) {
  // find a subscription with id === subscriberUID
  console.log('unsubscribe from stream placeholder');
}
