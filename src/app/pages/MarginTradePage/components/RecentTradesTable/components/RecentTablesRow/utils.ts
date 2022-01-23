import { TradePriceChange } from '../../types';
import imgArrowUp from 'assets/images/trend-arrow-up.svg';
import imgArrowDown from 'assets/images/trend-arrow-down.svg';

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

export const getPriceChange = (randomNumber: number) => {
  switch (randomNumber) {
    case 0:
      return TradePriceChange.DOWN;
    case 1:
      return TradePriceChange.UP;
    default:
      return TradePriceChange.NO_CHANGE;
  }
};
