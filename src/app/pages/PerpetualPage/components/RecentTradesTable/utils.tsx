import React from 'react';
import { TradePriceChange, TradeType } from './types';
import { ReactComponent as ImageArrowUp } from 'assets/images/trend-arrow-up.svg';
import { ReactComponent as ImageArrowDown } from 'assets/images/trend-arrow-down.svg';

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

export const getPriceChangeImage = (
  priceChange: TradePriceChange,
  typeColor: string,
) => {
  switch (priceChange) {
    case TradePriceChange.UP:
      return (
        <ImageArrowUp
          className="tw-inline-block tw-w-2.5 tw-mr-1"
          color={typeColor}
        />
      );
    case TradePriceChange.DOWN:
      return (
        <ImageArrowDown
          className="tw-inline-block tw-w-2.5 tw-mr-1"
          color={typeColor}
        />
      );
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
