import { weiTo18 } from 'utils/blockchain/math-helpers';
import { bignumber } from 'mathjs';
import type { OpenLoanType } from 'types/active-loan';
import { TradingPosition } from 'types/trading-position';
import imgArrowUp from 'assets/images/trend-arrow-up.svg';
import imgArrowDown from 'assets/images/trend-arrow-down.svg';
import { TradePriceChange } from '../types';

export function getEntryPrice(item: OpenLoanType, position: TradingPosition) {
  if (position === TradingPosition.LONG) {
    return Number(weiTo18(item.collateralToLoanRate));
  }
  return 1 / Number(weiTo18(item.collateralToLoanRate));
}

export function isLongTrade(position: TradingPosition) {
  return position === TradingPosition.LONG;
}

export function getPriceChangeImage(priceChange: TradePriceChange) {
  switch (priceChange) {
    case TradePriceChange.UP:
      return imgArrowUp;
    case TradePriceChange.DOWN:
      return imgArrowDown;
    default:
      return undefined;
  }
}

export function getPriceColor(priceChange: TradePriceChange) {
  if (priceChange === TradePriceChange.NO_CHANGE) {
    return undefined;
  }

  return priceChange === TradePriceChange.UP
    ? 'tw-text-trade-long'
    : 'tw-text-trade-short';
}

export function getPriceChange(priceDirection: number) {
  switch (priceDirection) {
    case 0:
      return TradePriceChange.DOWN;
    case 1:
      return TradePriceChange.UP;
    default:
      return TradePriceChange.NO_CHANGE;
  }
}

export function getTradingPositionPrice(
  item: OpenLoanType,
  position: TradingPosition,
) {
  if (position === TradingPosition.LONG) {
    return Number(weiTo18(item.collateralToLoanRate));
  }
  return 1 / Number(weiTo18(item.collateralToLoanRate));
}

export function calculateMinimumReturn(amount: string, slippage: number = 0.1) {
  return {
    amount,
    slippage,
    minReturn: bignumber(amount)
      .sub(bignumber(amount).mul(slippage / 100))
      .toFixed(0),
  };
}
