import { bignumber } from 'mathjs';
import { TradingPosition } from 'types/trading-position';
import imgArrowUp from 'assets/images/trend-arrow-up.svg';
import imgArrowDown from 'assets/images/trend-arrow-down.svg';
import { TradePriceChange } from 'types/trading-pairs';
import {
  MarginLoansLiquidateFragment,
  MarginLoansCloseWithSwapFragment,
} from 'utils/graphql/rsk/generated';

export const isLongTrade = (position: TradingPosition) => {
  return position === TradingPosition.LONG;
};

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

export const getPriceChange = (priceDirection: number) => {
  switch (priceDirection) {
    case 0:
      return TradePriceChange.DOWN;
    case 1:
      return TradePriceChange.UP;
    default:
      return TradePriceChange.NO_CHANGE;
  }
};

export const getOpenPositionPrice = (
  price: string,
  position: TradingPosition,
) => {
  if (!isLongTrade(position)) {
    return price;
  }
  return (1 / Number(price)).toString();
};

export const getClosePositionPrice = (
  liquidates: MarginLoansLiquidateFragment[],
  closeWithSwaps: MarginLoansCloseWithSwapFragment[],
  position: TradingPosition,
) => {
  const sortedList = liquidates.slice().sort((a, b) => {
    return b.timestamp - a.timestamp;
  });

  if (sortedList.length > 0) {
    if (isLongTrade(position)) {
      return sortedList[0].collateralToLoanRate;
    }
    return (1 / Number(sortedList[0].collateralToLoanRate)).toString();
  } else {
    if (!isLongTrade(position)) {
      return closeWithSwaps[0].exitPrice;
    }
    return (1 / Number(closeWithSwaps[0].exitPrice)).toString();
  }
};

export const getExitTransactionHash = (
  liquidates: MarginLoansLiquidateFragment[],
  closeWithSwaps: MarginLoansCloseWithSwapFragment[],
) => {
  const sortedList = liquidates.slice().sort((a, b) => {
    return b.timestamp - a.timestamp;
  });

  if (sortedList.length > 0) {
    return sortedList[0].transaction.id;
  } else {
    return closeWithSwaps[0].transaction.id;
  }
};

export const calculateMinimumReturn = (
  amount: string,
  slippage: number = 0.1,
) => ({
  amount,
  slippage,
  minimumPrice: bignumber(amount)
    .sub(bignumber(amount).mul(slippage / 100))
    .toFixed(0),
  maximumPrice: bignumber(amount)
    .add(bignumber(amount).mul(slippage / 100))
    .toFixed(0),
});
