import { StringifyOptions } from 'querystring';

export enum TradePriceChange {
  'UP' = 'up',
  'DOWN' = 'down',
  'NO_CHANGE' = 'noChange',
}

export enum TradeType {
  'SELL' = 'sell',
  'BUY' = 'buy',
}

export type RecentTradesDataEntry = {
  id: string;
  type: TradeType;
  priceChange: TradePriceChange;
  price: number;
  size: number;
  time: string;
};

export type TradeEvent = {
  address: string;
  blockNumber: number;
  logIndex: number;
  transactionHash: string;
  transactionIndex: number;
  perpetualId: string;
  trader: string;
  orderFlags: string;
  tradeAmount: string;
  price: string;
  blockTimestamp: string;
};
