import { BigNumber } from 'ethers';

export const ONE_64x64 = BigNumber.from('0x10000000000000000');

export const PERPETUAL_ID =
  '0xada5013122d395ba3c54772283fb069b10426056ef8ca54750cb9bb552a59e7d';

// Converts float to ABK64x64 bigint-format, creates string from number with 18 decimals
export const floatToABK64x64 = (value: number) => {
  if (value === 0) {
    return BigNumber.from(0);
  }

  const sign = Math.sign(value);
  const absoluteValue = Math.abs(value);

  const stringValueArray = absoluteValue.toFixed(18).split('.');
  const integerPart = BigNumber.from(stringValueArray[0]);
  const decimalPart = BigNumber.from(stringValueArray[1]);

  const integerPartBigNumber = integerPart.mul(ONE_64x64);
  const dec18 = BigNumber.from(10).pow(BigNumber.from(18));
  const decimalPartBigNumber = decimalPart.mul(ONE_64x64).div(dec18);

  return integerPartBigNumber.add(decimalPartBigNumber).mul(sign);
};
