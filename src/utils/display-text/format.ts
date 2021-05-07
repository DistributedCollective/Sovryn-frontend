import { weiToFixed, weiTo18, fromWei } from '../blockchain/math-helpers';
import { bignumber } from 'mathjs';

export function formatAsNumber(value, decimals): number {
  return parseFloat(weiToFixed(value, decimals).toLocaleString());
}

export function weiToNumberFormat(value: any, decimals: number = 0) {
  return toNumberFormat(Number(fromWei(value || '0')), decimals);
}

export function toNumberFormat(value: number, decimals: number = 0) {
  return value.toLocaleString('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
}

export function numberToUSD(value: number, decimals: number) {
  if (value === null) {
    return null;
  }
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'code',
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
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

export function calculateLiquidation(
  isLong: boolean,
  leverage: number,
  maintenanceStr: string,
  startRateStr: string,
): number {
  const startRate = isLong
    ? startRateStr
    : bignumber(1).div(startRateStr).mul(1e18).toString();

  const maintenanceMargin: number =
    parseFloat(weiToFixed(maintenanceStr, 4)) / 100;

  const priceMovement =
    1 - ((1 + maintenanceMargin) * (leverage - 1)) / leverage;

  if (isLong) {
    return Number(
      bignumber(bignumber(1).minus(priceMovement))
        .mul(bignumber(fromWei(startRate, 'ether')))
        .toFixed(18),
    );
  }

  return Number(
    bignumber(bignumber(1).add(priceMovement))
      .mul(bignumber(fromWei(startRate, 'ether')))
      .mul(1e18)
      .toFixed(18),
  );

  // const liquidationPriceLong: number =
  //   (startRate * leverage) / (leverage + 1 - maintenanceMargin * leverage);
  // const liquidationPriceShort: number =
  //   (startRate * leverage) / (leverage - 1 + maintenanceMargin * leverage);
  // return isLong ? liquidationPriceLong : liquidationPriceShort;
}

export function calculateProfit(
  collateralStr: string,
  startRateStr: string,
  currentPriceBTC: number,
  isLong: boolean,
): number {
  const positionSize: number = parseFloat(weiTo18(collateralStr));
  const startPrice: number = parseFloat(weiTo18(startRateStr));
  const currentPriceUSD: number = 1 / currentPriceBTC;

  const profitLong = positionSize * currentPriceBTC - positionSize * startPrice;
  const profitShort =
    (positionSize * currentPriceUSD - positionSize * startPrice) *
    currentPriceBTC;

  return isLong ? profitLong : profitShort;
}

// export function calculateProfit(
//   startPrice: number,
//   currentPrice: number,
//   isLong: boolean,
//   collateral: string,
// ) {
//   const positionSize = parseFloat(weiTo18(collateral));
//   if (isLong) {
//     return positionSize * currentPrice - positionSize * startPrice;
//   }
//   return positionSize * startPrice - positionSize * currentPrice;
// }
