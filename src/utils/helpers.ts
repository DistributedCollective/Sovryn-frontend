import { utils } from '@rsksmart/rsk3';
import { bignumber } from 'mathjs';
import { currentChainId } from './classifiers';
import { gas } from './blockchain/gas-price';
import { Asset } from '../types/asset';

export const isObjectEmpty = (obj: {}) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const booleafy = (value: boolean) => (value ? 1 : 0);

export const prettyTx = (
  text: string,
  startLength: number = 6,
  endLength: number = 4,
) => {
  const start = text.substr(0, startLength);
  const end = text.substr(-endLength);
  return `${start} ··· ${end}`;
};

export const handleNumberInput = (value, onlyPositive = true) => {
  return handleNumber(value.currentTarget.value, onlyPositive);
};

export const handleNumber = (value, onlyPositive = true) => {
  if (value === undefined || value === null) {
    value = '';
  }

  if (value === '') {
    return value;
  }

  let number = value.replace(',', '.').replace(/[^\d.-]/g, '');

  if (onlyPositive) {
    number = number.replace('-', '');
  }

  if (onlyPositive && Number(number) < 0) {
    return Math.abs(number).toString();
  }

  if (number.length === 1 && number === '.') {
    return '0.';
  }

  if (isNaN(number) && number !== '-') {
    return '';
  }

  return number.toString();
};

export const toChecksumAddress = (address: string) => {
  try {
    return !!address ? utils.toChecksumAddress(address) : '';
  } catch (e) {
    return address;
  }
};

export const checkAddressChecksum = (address: string) => {
  try {
    return utils.checkAddressChecksum(address, currentChainId);
  } catch (e) {
    console.warn(e);
    return false;
  }
};

export const isAddress = (address: string) => {
  try {
    return utils.isAddress((address || '').toLowerCase(), currentChainId);
  } catch (e) {
    console.warn(e);
    return false;
  }
};

export const validateEmail = (email: string) => {
  // eslint-disable-next-line no-useless-escape
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const toChunks = (from: number, to: number, size: number) => {
  let end = from;
  let array: Array<number[]> = [];
  const amount = to - from;
  const chunks = Math.floor(amount / size);
  const reminder = amount % size;

  if (chunks) {
    for (let i = 0; i < chunks; i++) {
      const chunkEnd = end + size;
      array.push([end, chunkEnd - 1]);
      end = chunkEnd;
    }
  }
  if (reminder) {
    array.push([end, end + reminder]);
  }
  return array;
};

export const maxMinusFee = (amount: any, asset: Asset = Asset.RBTC) => {
  if (asset !== Asset.RBTC) return amount;
  const gasPrice = gas.get();
  const gasLimit = 2000000;
  const fee = bignumber(gasPrice).mul(gasLimit);
  const balance = bignumber(amount).sub(fee);
  if (balance.lessThanOrEqualTo(0)) {
    return '0';
  }
  return balance.toFixed(0);
};

/**
 * Returns true if value is one of true, 1, on or yes.
 * All other values considered as false
 * @param value
 */
export function isChecked(value: any) {
  value = String(value || false).toLowerCase();
  return ['true', '1', 'on', 'yes'].includes(value);
}

export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

export function makeId(length: number = 8): string {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
