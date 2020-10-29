import { weiToFixed, weiTo18 } from '../blockchain/math-helpers';
import { symbolByTokenAddress } from '../blockchain/contract-helpers';

export function formatAsUSD(value) {
  return `$ ${parseFloat(weiTo18(value)).toLocaleString('en', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatAsBTCPrice(value, address) {
  return symbolByTokenAddress(address) === 'BTC'
    ? `$ ${parseFloat(weiTo18(value)).toLocaleString('en', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : `$ ${(1 / parseFloat(weiTo18(value))).toLocaleString('en', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
}

export function formatAsBTC(value, address) {
  return `${parseFloat(weiToFixed(value, 4))} 
        ${symbolByTokenAddress(address)}`;
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
