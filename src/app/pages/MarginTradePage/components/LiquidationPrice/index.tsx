import React from 'react';
import { Asset } from 'types/asset';
import { TradingPosition } from 'types/trading-position';
import { useBorrowAssetPrice } from 'app/hooks/trading/useBorrowAssetPrice';
import { fromWei } from 'utils/blockchain/math-helpers';
import { useBorrowLiquidationPrice } from 'app/hooks/trading/useBorrowLiquidationPrice';
import { bignumber } from 'mathjs';
import { LoadableValue } from '../../../../components/LoadableValue';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { AssetRenderer } from 'app/components/AssetRenderer';

interface ILiquidationPriceProps {
  asset: Asset;
  assetLong: Asset;
  leverage: number;
  position: TradingPosition;
}

export function LiquidationPrice(props: ILiquidationPriceProps) {
  const { value: price, loading: loadingPrice } = useBorrowAssetPrice(
    props.asset,
    props.assetLong,
  );

  const {
    value: longToUsd,
    loading: loadingLongToUsdPrice,
  } = useBorrowAssetPrice(props.assetLong, Asset.USDT);

  const { value, loading: loadingLiq } = useBorrowLiquidationPrice(
    props.asset,
    bignumber(price).mul(bignumber(longToUsd).div(1e18)).toFixed(0),
    props.leverage,
    props.position,
  );

  return (
    <LoadableValue
      value={<>{weiToNumberFormat(value, 2)}</>}
      tooltip={
        <>
          {fromWei(value)} <AssetRenderer asset={props.assetLong} />
        </>
      }
      loading={loadingPrice || loadingLiq || loadingLongToUsdPrice}
    />
  );
}
