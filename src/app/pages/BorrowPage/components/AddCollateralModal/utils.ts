import { bignumber } from 'mathjs';

export const calculateLiquidationPrice = (
  principal: string,
  collateral: string,
  ratio: string,
) =>
  bignumber(bignumber(principal).mul(bignumber(ratio).div(100)))
    .div(collateral)
    .toString();
