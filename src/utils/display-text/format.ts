import { bignumber } from 'mathjs';
import {
  weiToFixed,
  weiTo18,
  fromWei,
  roundToSmaller,
} from '../blockchain/math-helpers';

import { Asset } from 'types';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';

export function formatAsNumber(value, decimals): number {
  return parseFloat(weiToFixed(value, decimals).toLocaleString());
}

export function weiToNumberFormat(value: any, decimals: number = 0) {
  return toNumberFormat(Number(fromWei(value || '0')), decimals);
}

export function weiToAssetNumberFormat(value: any, asset: Asset) {
  return weiToNumberFormat(
    value,
    AssetsDictionary.get(asset)?.displayDecimals || 8,
  );
}

export function toAssetNumberFormat(value: number | string, asset: Asset) {
  return toNumberFormat(
    value,
    AssetsDictionary.get(asset)?.displayDecimals || 8,
  );
}

export function weiToUSD(
  value: string,
  decimals: number = 4,
  minDecimals: number = decimals,
) {
  return numberToUSD(
    Number(weiToFixed(value, decimals)),
    decimals,
    minDecimals,
  );
}

export function toNumberFormat(value: number | string, decimals: number = 0) {
  if (isNaN(Number(value))) value = 0;
  return Number(value).toLocaleString(navigator.language, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
}

export function numberToUSD(
  value: number,
  decimals: number = 4,
  minDecimals: number = decimals,
) {
  if (value === null) {
    return null;
  }
  return value.toLocaleString(navigator.language, {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'code',
    maximumFractionDigits: decimals,
    minimumFractionDigits: minDecimals,
  });
}

export function numberToPercent(value: number, decimals: number) {
  return (
    value.toLocaleString(navigator.language, {
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
  return `${value.toLocaleString(navigator.language, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })}
        ${currency}`;
}

export function stringToPercent(value, decimals) {
  return `${parseFloat(weiTo18(value)).toLocaleString(navigator.language, {
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
}

export function calculateProfit(
  isLong: boolean,
  currentPrice: number,
  startPrice: number,
  amount: string,
): [string, number] {
  let profit = '0';
  let diff = 1;
  if (isLong) {
    diff = (currentPrice - startPrice) / currentPrice;
    profit = bignumber(amount).mul(diff).toFixed(0);
  } else {
    diff = (startPrice - currentPrice) / startPrice;
    profit = bignumber(amount).mul(diff).toFixed(0);
  }

  return [profit, diff];
}

const decimalPartLength = value => {
  const decimalPart = value?.split('.')[1];
  return decimalPart?.length ?? 0;
};

export const stringToFixedPrecision = (value: string, precision: number) => {
  if (decimalPartLength(value) > precision)
    return roundToSmaller(value, precision);

  return value;
};
