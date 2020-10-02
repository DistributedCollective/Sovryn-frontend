import { bignumber } from 'mathjs';
import { fromWei } from 'web3-utils';

export const weiToBn = (amount: any) =>
  bignumber(fromWei(String(amount || '0'), 'ether'));

export const weiToFixed = (amount: any, decimals: number = 0) =>
  roundToSmaller(Number(weiToBn(amount)), decimals);

export const weiTo18 = (amount: any) => weiToFixed(amount, 18);

export const weiTo4 = (amount: any) => weiToFixed(amount, 4);

export const weiTo2 = (amount: any) => weiToFixed(amount, 2);

export const roundToSmaller = (amount: number, decimals: number) => {
  return (
    amount.toString().match('^-?\\d+(?:\\.\\d{0,' + decimals + '})?')?.[0] ||
    '0'
  );
};
