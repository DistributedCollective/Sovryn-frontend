/**
 *
 * ActiveLoanLiquidation
 *
 */

import React, { useState, useEffect } from 'react';
import { weiTo18, toWei } from 'utils/blockchain/math-helpers';
import { useBorrowLiquidationPrice } from '../../../../hooks/trading/useBorrowLiquidationPrice';
import { TradingPosition } from 'types/trading-position';
import { Asset } from 'types/asset';
import { leverageFromMargin } from 'utils/blockchain/leverage-from-start-margin';

interface Props {
  asset: Asset;
  isLong: boolean;
  item: any; // todo add type
  currentPrice: any; // todo fix type
}

export function ActiveLoanLiquidation(props: Props) {
  const [danger, setDanger] = useState<boolean>(false);

  const priceInWei = props.isLong
    ? props.item.startRate
    : toWei(1 / parseFloat(weiTo18(props.item.startRate)));
  const leverage = leverageFromMargin(props.item.startMargin);
  const position = props.isLong ? TradingPosition.LONG : TradingPosition.SHORT;

  const { value: liquidationPrice } = useBorrowLiquidationPrice(
    props.asset,
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
      {parseFloat(weiTo18(liquidationPrice)).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  );
}
