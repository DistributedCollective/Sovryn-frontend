/**
 *
 * BorrowLiquidationPrice
 *
 */
import React from 'react';
import { Tooltip } from '@blueprintjs/core';
import { Asset } from 'types/asset';
import { TradingPosition } from 'types/trading-position';
import { useBorrowAssetPrice } from 'app/hooks/trading/useBorrowAssetPrice';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { useBorrowLiquidationPrice } from 'app/hooks/trading/useBorrowLiquidationPrice';
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
      <div className="d-inline text-lightGrey">Liquidation Price</div>
      <div className="d-inline float-right">
        <LoadableValue
          value={
            <Tooltip content={<>${weiToFixed(value, 18)}</>}>
              <>
                <span className="text-lightGrey">$</span>
                {weiToFixed(value, 4)}
              </>
            </Tooltip>
          }
          loading={loading}
        />
      </div>
    </div>
  );
}
