import { bignumber } from 'mathjs';
import { fromWei } from 'web3-utils';

export const weiToBn = (amount: any) => bignumber(fromWei(amount, 'ether'));

export const weiToFixed = (amount: any, decimals: number = 0) =>
  weiToBn(amount).toFixed(decimals);

export const weiTo18 = (amount: any) => weiToFixed(amount, 18);

export const weiTo4 = (amount: any) => weiToFixed(amount, 4);
