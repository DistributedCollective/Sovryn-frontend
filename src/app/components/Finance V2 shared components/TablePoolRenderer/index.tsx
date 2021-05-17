import React from 'react';
import { Asset } from '../../../../types/asset';
import { getAssetColor } from '../utils/getAssetColor';
import { PoolAsset } from './styled';

interface ITablePoolRendererProps {
  asset: Asset;
  secondaryAsset?: Asset;
}

export const TablePoolRenderer: React.FC<ITablePoolRendererProps> = ({
  asset,
  secondaryAsset,
}) => (
  <div>
    <PoolAsset assetColor={getAssetColor(asset)}>{asset}</PoolAsset>
    {secondaryAsset && (
      <PoolAsset assetColor={getAssetColor(secondaryAsset)} className="tw-pt-1">
        {secondaryAsset}
      </PoolAsset>
    )}
  </div>
);
