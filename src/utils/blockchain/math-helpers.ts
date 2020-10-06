import { bignumber } from 'mathjs';
import { fromWei } from 'web3-utils';

export const weiToBn = (amount: any) =>
  bignumber(fromWei(String(amount || '0'), 'ether'));

export const weiToFixed = (amount: any, decimals: number = 0): string =>
  roundToSmaller(weiToBn(amount).toFixed(64), decimals);

export const weiTo18 = (amount: any): string => weiToFixed(amount, 18);

export const weiTo4 = (amount: any): string => weiToFixed(amount, 4);

export const weiTo2 = (amount: any): string => weiToFixed(amount, 2);

export const roundToSmaller = (amount: any, decimals: number): string => {
  return (
    String(toFixed(amount)).match(
      '^-?\\d+(?:\\.\\d{0,' + decimals + '})?',
    )?.[0] || '0'
  );
};

function toFixed(x) {
  x = Number(x);
  if (Math.abs(x) < 1.0) {
    const e = parseInt(x.toString().split('e-')[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = '0.' + new Array(e).join('0') + x.toString().substring(2);
    }
  } else {
    let e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += new Array(e + 1).join('0');
    }
  }
  return x;
}
