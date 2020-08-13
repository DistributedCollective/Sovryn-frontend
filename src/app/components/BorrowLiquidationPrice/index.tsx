/**
 *
 * BorrowLiquidationPrice
 *
 */
import React from 'react';
import { Tooltip } from '@blueprintjs/core';
import { Asset } from 'types/asset';
import { TradingPosition } from 'types/trading-position';
import { useBorrowAssetPrice } from 'hooks/borrow/useBorrowAssetPrice';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { useBorrowLiquidationPrice } from 'hooks/borrow/useBorrowLiquidationPrice';
import { LoadableValue } from '../LoadableValue';

interface Props {
  asset: Asset;
  leverage: number;
  position: TradingPosition;
}

export function BorrowLiquidationPrice(props: Props) {
  const { value: price } = useBorrowAssetPrice(props.asset);
  const { value, loading } = useBorrowLiquidationPrice(
    props.asset,
    price,
    props.leverage,
    props.position,
  );
  return (
    <div className="mb-2">
      <div>Liquidation Price</div>
      <div>
        <LoadableValue
          value={
            <Tooltip content={<>${weiToFixed(value, 18)}</>}>
              <>${weiToFixed(value, 4)}</>
            </Tooltip>
          }
          loading={loading}
        />
      </div>
    </div>
  );
}
