/**
 *
 * ActiveLoanProfit
 *
 */
import React from 'react';
import { fromWei } from '../../../utils/blockchain/math-helpers';
import { useBorrowAssetPrice } from 'app/hooks/trading/useBorrowAssetPrice';
import { Asset } from 'types/asset';

export function ActiveLoanProfit(props) {
  const collateral = parseInt(fromWei(props.item.collateral));
  const collateralCurrentValue =
    collateral * useBorrowAssetPrice(Asset.BTC, Asset.DOC).value;
  const collateralStartValue =
    collateral * parseInt(fromWei(props.item.startRate));
  const profit = collateralCurrentValue - collateralStartValue;

  return <span>Profit</span>;
}
