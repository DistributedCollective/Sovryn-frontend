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
