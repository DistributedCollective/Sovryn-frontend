import { bignumber } from 'mathjs';
import { Asset } from 'types';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { Unit } from 'web3-utils';

export const normalizeWei = (amount: string) => {
  return roundToSmaller(amount, 0);
};

export const weiToFixed = (amount: any, decimals: number = 0): string => {
  return roundToSmaller(bignumber(fromWei(amount, 'ether')), decimals);
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
  if (amount === Infinity) {
    amount = '0';
  }
  const bn = bignumber(amount || '0');
  let [integer, decimal] = bn.toFixed(128).split('.');

  if (decimal && decimal.length) {
    decimal = decimal.substr(0, decimals);
  } else {
    decimal = '0'.repeat(decimals);
  }

  if (decimal.length < decimals) {
    decimal = decimal + '0'.repeat(decimals - decimal.length);
  }

  if (decimal !== '') {
    return `${integer}.${decimal}`;
  }
  return `${integer}`;
};

export const fromWei = (amount: any, unit: Unit = 'ether') => {
  let decimals = 0;
  switch (unit) {
    case 'ether':
      decimals = 18;
      break;
    case 'gwei':
      decimals = 9;
      break;
    default:
      throw new Error('Unsupported unit (custom fromWei helper)');
  }

  return roundToSmaller(bignumber(amount || '0').div(10 ** decimals), decimals);
};

export const numberFromWei = (amount: any, unit: Unit = 'ether') => {
  return Number(fromWei(amount, unit));
};

export const toWei = (amount: any, unit: Unit = 'ether') => {
  let decimals = 0;
  switch (unit) {
    case 'ether':
      decimals = 18;
      break;
    default:
      throw new Error('Unsupported unit (custom fromWei helper)');
  }

  return roundToSmaller(bignumber(amount || '0').mul(10 ** decimals), 0);
};

export const trimZero = (amount: string) => {
  return amount.replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1');
};

export const assetToWei = (amount: any, asset: Asset) => {
  return roundToSmaller(
    bignumber(amount || '0').mul(10 ** AssetsDictionary.get(asset).decimals),
    0,
  );
};

export const assetFromWei = (amount: any, asset: Asset) => {
  return roundToSmaller(
    bignumber(amount || '0').div(10 ** AssetsDictionary.get(asset).decimals),
    18,
  );
};

export const weiToFixedAsset = (
  amount: any,
  asset: Asset,
  decimals: number,
) => {
  return roundToSmaller(bignumber(assetFromWei(amount, asset)), decimals);
};
