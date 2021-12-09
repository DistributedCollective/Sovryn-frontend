import { TradePriceChange, TradeType } from '../../types';
import imgArrowUp from 'assets/images/trend-arrow-up.svg';
import imgArrowDown from 'assets/images/trend-arrow-down.svg';

export const getPriceChange = (
  previousPrice: number,
  price: number,
): TradePriceChange => {
  if (previousPrice < price) {
    return TradePriceChange.UP;
  } else if (previousPrice > price) {
    return TradePriceChange.DOWN;
  } else {
    return TradePriceChange.NO_CHANGE;
  }
};

export const getTradeType = (tradeAmount: number): TradeType =>
  tradeAmount < 0 ? TradeType.SELL : TradeType.BUY;

export const getPriceChangeImage = (priceChange: TradePriceChange) => {
  switch (priceChange) {
    case TradePriceChange.UP:
      return imgArrowUp;
    case TradePriceChange.DOWN:
      return imgArrowDown;
    default:
      return undefined;
  }
};
export const getPriceColor = (priceChange: TradePriceChange) => {
  if (priceChange === TradePriceChange.NO_CHANGE) {
    return undefined;
  }

  return priceChange === TradePriceChange.UP
    ? 'tw-text-trade-long'
    : 'tw-text-trade-short';
};
