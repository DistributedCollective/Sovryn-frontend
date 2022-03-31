import { weiTo18 } from 'utils/blockchain/math-helpers';
import { bignumber } from 'mathjs';
import { TradingPosition } from 'types/trading-position';
import imgArrowUp from 'assets/images/trend-arrow-up.svg';
import imgArrowDown from 'assets/images/trend-arrow-down.svg';
import { TradePriceChange } from 'types/trading-pairs';
import { LoanEvent } from '../components/OpenPositionsTable/hooks/useMargin_getLoanEvents';

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

export const getTradingPositionPrice = (
  item: LoanEvent,
  position: TradingPosition,
) => {
  if (position === TradingPosition.LONG) {
    return Number(weiTo18(item.collateralToLoanRate));
  }
  return 1 / Number(weiTo18(item.collateralToLoanRate));
};

export const calculateMinimumReturn = (
  amount: string,
  slippage: number = 0.1,
) => {
  return {
    amount,
    slippage,
    minReturn: bignumber(amount)
      .sub(bignumber(amount).mul(slippage / 100))
      .toFixed(0),
  };
};
