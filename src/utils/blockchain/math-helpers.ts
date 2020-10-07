import { bignumber } from 'mathjs';
import { fromWei } from 'web3-utils';

export const weiToBn = (amount: any) =>
  bignumber(fromWei(String(amount || '0'), 'ether'));

export const weiToFixed = (amount: any, decimals: number = 0): string => {
  return roundToSmaller(weiToBn(amount).toFixed(128), decimals);
};

export const weiTo18 = (amount: any): string => weiToFixed(amount, 18);

export const weiTo4 = (amount: any): string => weiToFixed(amount, 4);

export const weiTo2 = (amount: any): string => weiToFixed(amount, 2);

export const weiToBigInt = (amount: any) => {
  if (amount) {
    return `${amount.split('.')[0]}.${
      amount.split('.')[1] ? amount.split('.')[1].slice(0, 18) : '0'
    }`;
  }
  return '0';
};

export const roundToSmaller = (amount: any, decimals: number): string => {
  let [integer, decimal] = bignumber(amount)
    .toFixed(decimals + 2)
    .split('.');

  if (decimal && decimal.length) {
    decimal = decimal.substr(0, decimals);
  } else {
    decimal = '0'.repeat(decimals);
  }

  if (decimal.length < decimals) {
    decimal = decimal + '0'.repeat(decimals - decimal.length);
  }

  return `${integer}.${decimal}`;
};
