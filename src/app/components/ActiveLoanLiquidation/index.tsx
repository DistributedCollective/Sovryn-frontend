/**
 *
 * ActiveLoanTable
 *
 */

import React from 'react';
import { weiTo18, toWei } from '../../../utils/blockchain/math-helpers';
import { symbolByTokenAddress } from '../../../utils/blockchain/contract-helpers';
import { useBorrowLiquidationPrice } from '../../hooks/trading/useBorrowLiquidationPrice';
import { TradingPosition } from 'types/trading-position';
import { Asset } from 'types/asset';
import { leverageFromMargin } from '../../../utils/blockchain/leverage-from-start-margin';

export function ActiveLoanLiquidation(props) {
  const asset = Asset.BTC;
  const priceInWei =
    symbolByTokenAddress(props.item.collateralToken) === 'BTC'
      ? props.item.startRate
      : toWei(1 / parseFloat(weiTo18(props.item.startRate)));
  const leverage = leverageFromMargin(props.item.startMargin);
  const position =
    symbolByTokenAddress(props.item.collateralToken) === 'BTC'
      ? TradingPosition.LONG
      : TradingPosition.SHORT;

  const { value: liquidationPrice } = useBorrowLiquidationPrice(
    asset,
    priceInWei,
    leverage,
    position,
  );
  return (
    <>
      $
      {parseFloat(weiTo18(liquidationPrice)).toLocaleString('en', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </>
  );
}
