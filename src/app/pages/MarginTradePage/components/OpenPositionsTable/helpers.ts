import { TradingPosition } from 'types/trading-position';

export const isLongTrade = (position: TradingPosition) =>
  position === TradingPosition.LONG;
