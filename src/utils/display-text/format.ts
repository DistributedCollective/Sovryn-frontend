import { weiToFixed, weiTo18, fromWei } from '../blockchain/math-helpers';
import { symbolByTokenAddress } from '../blockchain/contract-helpers';

export function formatAsNumber(value, decimals): number {
  return parseFloat(weiToFixed(value, 4).toLocaleString());
}

export function formatAsUSD(value) {
  return `$ ${parseFloat(weiTo18(value)).toLocaleString('en', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatAsBTCPrice(value, address): number {
  return symbolByTokenAddress(address) === 'BTC'
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

export function percentTo2(value) {
  return `${parseFloat(weiTo18(value)).toLocaleString('en', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} %`;
}

export function percentTo4(value) {
  return `${parseFloat(weiTo18(value)).toLocaleString('en', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })} %`;
}

export function calculateProfit(
  c: string,
  s: string,
  currentPrice: number,
  currency: string,
): number {
  const collateral: number = parseFloat(fromWei(c));
  const startRate: number = parseFloat(fromWei(s));
  const collateralCurrentValue =
    currency === 'BTC' ? collateral * currentPrice : collateral;
  const collateralStartValue =
    currency === 'BTC'
      ? collateral * startRate
      : collateral * (currentPrice * startRate);
  return collateralCurrentValue - collateralStartValue;
}
