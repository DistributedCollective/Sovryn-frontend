/**
 *
 * ActiveLoanTable
 *
 */

import React, { useState, useEffect } from 'react';
import { weiTo18, toWei } from 'utils/blockchain/math-helpers';
import { symbolByTokenAddress } from 'utils/blockchain/contract-helpers';
import { useBorrowLiquidationPrice } from '../../../../hooks/trading/useBorrowLiquidationPrice';
import { TradingPosition } from 'types/trading-position';
import { Asset } from 'types/asset';
import { leverageFromMargin } from 'utils/blockchain/leverage-from-start-margin';

export function ActiveLoanLiquidation(props) {
  const [danger, setDanger] = useState<boolean>(false);
  const tokenSymbol = symbolByTokenAddress(props.item.collateralToken);
  const asset = Asset.BTC;
  const priceInWei =
    tokenSymbol === 'BTC'
      ? props.item.startRate
      : toWei(1 / parseFloat(weiTo18(props.item.startRate)));
  const leverage = leverageFromMargin(props.item.startMargin);
  const position =
    tokenSymbol === 'BTC' ? TradingPosition.LONG : TradingPosition.SHORT;

  const { value: liquidationPrice } = useBorrowLiquidationPrice(
    asset,
    priceInWei,
    leverage,
    position,
  );

  useEffect(() => {
    parseFloat(liquidationPrice) < parseFloat(props.currentPrice) * 1.1 &&
    parseFloat(liquidationPrice) > parseFloat(props.currentPrice) * 0.9
      ? setDanger(true)
      : setDanger(false);
  }, [liquidationPrice, props.currentPrice]);

  return (
    <span style={{ color: danger ? 'var(--Gold)' : 'white' }}>
      ${' '}
      {parseFloat(weiTo18(liquidationPrice)).toLocaleString('en', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  );
}
