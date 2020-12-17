import { weiToFixed, weiTo18 } from '../blockchain/math-helpers';

export function formatAsNumber(value, decimals): number {
  return parseFloat(weiToFixed(value, decimals).toLocaleString());
}

export function numberToUSD(value: number, decimals: number) {
  if (value === null) {
    return null;
  }
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
}

export function numberToPercent(value: number, decimals: number) {
  return (
    value.toLocaleString(undefined, {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    }) + ' %'
  );
}

export function formatAsBTCPrice(value, isLongPosition: boolean): number {
  return isLongPosition
    ? parseFloat(weiTo18(value))
    : 1 / parseFloat(weiTo18(value));
}

export function formatAsBTC(value, currency) {
  return `${value.toLocaleString('en', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })} 
        ${currency}`;
}

export function stringToPercent(value, decimals) {
  return `${parseFloat(weiTo18(value)).toLocaleString('en', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })} %`;
}

// export function calculateProfit(
//   c: string,
//   s: string,
//   currentPrice: number,
//   isLong: boolean,
// ): number {
//   const collateral: number = parseFloat(fromWei(c));
//   const startRate: number = parseFloat(fromWei(s));
//   const collateralCurrentValue = isLong
//     ? collateral * currentPrice
//     : collateral;
//   const collateralStartValue = isLong
//     ? collateral * startRate
//     : collateral * (currentPrice * startRate);
//   return collateralCurrentValue - collateralStartValue;
// }

export function calculateProfit(
  startPrice: number,
  currentPrice: number,
  isLong: boolean,
  collateral: string,
) {
  const positionSize = parseFloat(weiTo18(collateral));
  if (isLong) {
    return positionSize * currentPrice - positionSize * startPrice;
  }
  return positionSize * startPrice - positionSize * currentPrice;
}
