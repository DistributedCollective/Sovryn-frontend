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
  type: TradeType;
  priceChange: TradePriceChange;
  price: number;
  size: number;
  time: string;
};
