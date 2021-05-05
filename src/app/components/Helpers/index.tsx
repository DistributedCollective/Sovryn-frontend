import React from 'react';
import { Asset } from '../../../types/asset';
import { AssetRenderer } from '../AssetRenderer';

export function RenderTradingPairName(asset1: Asset, asset2: Asset) {
  return (
    <>
      <AssetRenderer asset={asset1} /> - <AssetRenderer asset={asset2} />
    </>
  );
}
