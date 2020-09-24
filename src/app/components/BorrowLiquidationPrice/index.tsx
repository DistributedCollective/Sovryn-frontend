/**
 *
 * BorrowLiquidationPrice
 *
 */
import React from 'react';
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
    <div>
      <div className="text-MediumGrey data-label">Liquidation Price</div>
      <div className="data-container">
        <LoadableValue
          value={<>$ {weiToFixed(value, 2)}</>}
          loading={loading}
        />
      </div>
    </div>
  );
}
