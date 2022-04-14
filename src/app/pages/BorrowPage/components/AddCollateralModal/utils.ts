import { bignumber } from 'mathjs';

export const BORROW_MAINTENANCE_RATIO = '115';

export const calculateLiquidationPrice = (
  principal: string,
  collateral: string,
  ratio: string,
) =>
  bignumber(bignumber(principal).mul(bignumber(ratio).div(100)))
    .div(collateral)
    .toString();

export const calculateCollateralRatio = (
  principalAsCollateral: string,
  collateral: string,
) => bignumber(collateral).div(principalAsCollateral).mul(100).toFixed(3);
