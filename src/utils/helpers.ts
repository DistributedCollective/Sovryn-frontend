import { utils } from '@rsksmart/rsk3';

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
  return !!address ? utils.toChecksumAddress(address) : '';
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
