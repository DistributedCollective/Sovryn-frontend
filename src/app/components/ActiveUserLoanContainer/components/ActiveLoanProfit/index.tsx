/**
 *
 * ActiveLoanProfit
 *
 */
import React, { useState, useEffect } from 'react';
import { fromWei } from 'utils/blockchain/math-helpers';
import { symbolByTokenAddress } from 'utils/blockchain/contract-helpers';

export function ActiveLoanProfit(props) {
  const [profit, setProfit] = useState<number>(0);
  const collateral: number = parseFloat(fromWei(props.item.collateral));
  useEffect(() => {
    if (props.currentPrice) {
      const formattedPrice = parseFloat(fromWei(props.currentPrice));
      const collateralCurrentValue =
        symbolByTokenAddress(props.item.collateralToken) === 'BTC'
          ? collateral * formattedPrice
          : collateral;
      const collateralStartValue =
        symbolByTokenAddress(props.item.collateralToken) === 'BTC'
          ? collateral * parseFloat(fromWei(props.item.startRate))
          : collateral *
            (formattedPrice * parseFloat(fromWei(props.item.startRate)));
      setProfit(collateralCurrentValue - collateralStartValue);
    }
  }, [
    props.currentPrice,
    props.item.collateralToken,
    props.item.startRate,
    collateral,
  ]);

  return (
    <span style={{ color: profit >= 0 ? 'var(--Green)' : 'var(--Red)' }}>
      $
      {profit.toLocaleString('en', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      })}
    </span>
  );
}
