import { TradingPosition } from 'types/trading-position';
import { bignumber } from 'mathjs';
import { useCallback, useEffect, useState } from 'react';
import { fromWei, toWei } from 'web3-utils';
import { Asset } from 'types/asset';

export function useBorrowLiquidationPrice(
  asset: Asset,
  priceInWei: string,
  leverage: number,
  position: TradingPosition,
) {
  //hardcoded here, but should be read from the margin pool params on the smart contract
  const maintenanceMargin = 0.15;
  const loading = false;

  const calculatePriceMovement = useCallback(() => {
    return bignumber(1).div(leverage).minus(maintenanceMargin);
  }, [leverage, maintenanceMargin]);

  const [maxPriceMovement, setMaxPriceMovement] = useState(
    calculatePriceMovement(),
  );

  const calculateLiquidation = useCallback(() => {
    if (position === TradingPosition.LONG) {
      return toWei(
        bignumber(bignumber(1).minus(maxPriceMovement))
          .mul(bignumber(fromWei(priceInWei, 'ether')))
          .toString(),
      );
    }
    return toWei(
      bignumber(bignumber(1).add(maxPriceMovement))
        .mul(bignumber(fromWei(priceInWei, 'ether')))
        .toString(),
    );
  }, [position, maxPriceMovement, priceInWei]);

  const [value, setValue] = useState(calculateLiquidation());

  useEffect(() => {
    setMaxPriceMovement(calculatePriceMovement());
  }, [leverage, maintenanceMargin, calculatePriceMovement]);

  useEffect(() => {
    setValue(calculateLiquidation());
  }, [
    maintenanceMargin,
    maxPriceMovement,
    priceInWei,
    position,
    leverage,
    calculateLiquidation,
  ]);

  return {
    value,
    loading,
  };
}
