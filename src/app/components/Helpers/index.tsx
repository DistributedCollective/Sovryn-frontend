import React from 'react';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { Asset } from '../../../types/asset';
import { AssetRenderer } from '../AssetRenderer';

interface IRenderTradingPairNameProps {
  asset1: Asset;
  asset2: Asset;
}

export const RenderTradingPairName: React.FC<IRenderTradingPairNameProps> = ({
  asset1,
  asset2,
}) => {
  const assetPair1 = AssetsDictionary.get(asset1).logoSvg;
  const assetPair2 = AssetsDictionary.get(asset2).logoSvg;
  return (
    <>
      <div className="tw-flex tw-items-center">
        <div className="tw-flex">
          <img
            className="tw-w-7 tw-relative tw-z-10"
            src={assetPair1}
            alt={asset1}
          />
          <img
            className="tw-w-7 tw-relative tw--left-3"
            src={assetPair2}
            alt={asset2}
          />
        </div>
        <div>
          <AssetRenderer asset={asset1} />/<AssetRenderer asset={asset2} />
        </div>
      </div>
    </>
  );
};
