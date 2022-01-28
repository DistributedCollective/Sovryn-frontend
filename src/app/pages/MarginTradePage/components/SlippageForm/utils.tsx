import { bignumber } from 'mathjs';

export const calculateMinimumReturn = (
  amount: string,
  slippage: number = 0.1,
) => {
  return {
    amount,
    slippage,
    minReturn: bignumber(amount)
      .sub(bignumber(amount).mul(slippage / 100))
      .toFixed(0),
  };
};
