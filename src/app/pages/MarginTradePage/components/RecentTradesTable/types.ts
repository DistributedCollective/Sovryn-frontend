export enum TradePriceChange {
  'UP' = 'up',
  'DOWN' = 'down',
  'NO_CHANGE' = 'noChange',
}

export enum TradeType {
  'SHORT' = 'short',
  'LONG' = 'long',
}

export type RecentTradesDataEntry = {
  collateralToken: string;
  entryPrice: string;
  loanToken: string;
  positionSize: string;
  timestamp: string;
  priceChange: TradePriceChange;
};
