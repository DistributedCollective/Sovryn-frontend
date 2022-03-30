import React from 'react';
import { Asset } from 'types/asset';
import { TradingPosition } from 'types/trading-position';
import { useBorrowAssetPrice } from 'app/hooks/trading/useBorrowAssetPrice';
import { fromWei } from 'utils/blockchain/math-helpers';
import { useBorrowLiquidationPrice } from 'app/hooks/trading/useBorrowLiquidationPrice';
import { bignumber } from 'mathjs';
import { LoadableValue } from '../../../../components/LoadableValue';
import { weiToAssetNumberFormat } from '../../../../../utils/display-text/format';
import { AssetRenderer } from 'app/components/AssetRenderer';

interface ILiquidationPriceProps {
  asset: Asset;
  assetLong: Asset;
  leverage: number;
  position: TradingPosition;
}

export const LiquidationPrice: React.FC<ILiquidationPriceProps> = ({
  asset,
  assetLong,
  leverage,
  position,
}) => {
  const { value: price, loading: loadingPrice } = useBorrowAssetPrice(
    asset,
    assetLong,
  );

  const {
    value: longToUsd,
    loading: loadingLongToUsdPrice,
  } = useBorrowAssetPrice(assetLong, Asset.USDT);

  const { value, loading: loadingLiq } = useBorrowLiquidationPrice(
    asset,
    bignumber(price).mul(bignumber(longToUsd).div(1e18)).toFixed(0),
    leverage,
    position,
  );

  return (
    <LoadableValue
      value={<>{weiToAssetNumberFormat(value, assetLong)}</>}
      tooltip={
        <>
          {fromWei(value)} <AssetRenderer asset={assetLong} />
        </>
      }
      loading={loadingPrice || loadingLiq || loadingLongToUsdPrice}
    />
  );
};
