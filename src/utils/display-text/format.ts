import {
  weiToFixed,
  weiTo18,
  fromWei,
  roundToSmaller,
  weiToFixedAsset,
  assetFromWei,
} from '../blockchain/math-helpers';
import { bignumber } from 'mathjs';
import { Asset } from 'types';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';

export function formatAsNumber(value, decimals): number {
  return parseFloat(weiToFixed(value, decimals).toLocaleString());
}

export function weiToNumberFormat(value: any, decimals: number = 0) {
  return toNumberFormat(Number(fromWei(value || '0')), decimals);
}

export function formatAssetAsNumber(
  value: any,
  asset: Asset,
  decimals: number,
): number {
  return parseFloat(weiToFixedAsset(value, asset, decimals).toLocaleString());
}

export function weiToAssetNumberFormat(
  value: any,
  asset: Asset,
  decimals: number = 0,
) {
  return toNumberFormat(Number(assetFromWei(value || '0', asset)), decimals);
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

export function assetWeiToUSD(
  value: string,
  asset: Asset,
  decimals: number = 4,
  minDecimals: number = decimals,
) {
  return numberToUSD(
    Number(weiToFixedAsset(value, asset, decimals)),
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

const decimalPartLength = value => {
  const decimalPart = value?.split('.')[1];
  return decimalPart?.length ?? 0;
};

export const stringToFixedPrecision = (value: string, precision: number) => {
  if (decimalPartLength(value) > precision)
    return roundToSmaller(value, precision);

  return value;
};
