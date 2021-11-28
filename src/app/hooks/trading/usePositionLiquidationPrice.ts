import { bignumber } from 'mathjs';
import { TradingPosition } from 'types/trading-position';
import { MAINTENANCE_MARGIN } from 'utils/classifiers';

export function usePositionLiquidationPrice(
  principal: string,
  collateral: string,
  position: TradingPosition,
  maintenanceMargin: number | string = MAINTENANCE_MARGIN,
) {
  //liquidation_collateralToLoanRate = ((maintenance_margin * principal / 10^20) + principal) / collateral * 10^18
  //If SHORT -> 10^36 / liquidation_collateralToLoanRate

  const liquidation_collateralToLoanRate = bignumber(
    bignumber(
      bignumber(maintenanceMargin)
        .mul(principal)
        .div(10 ** 20)
        .add(principal),
    ),
  )
    .div(collateral)
    .mul(10 ** 18);

  if (position === TradingPosition.LONG) {
    return liquidation_collateralToLoanRate.div(10 ** 18).toString();
  }

  return bignumber(10 ** 36)
    .div(liquidation_collateralToLoanRate)
    .div(10 ** 18)
    .toString();
}
