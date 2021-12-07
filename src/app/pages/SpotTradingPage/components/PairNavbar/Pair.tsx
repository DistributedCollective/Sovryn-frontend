import React from 'react';
import { pairs, SpotPairType } from '../../types';
import { Asset } from 'types/asset';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';

interface IPair {
  pairType: SpotPairType;
}

export const Pair: React.FC<IPair> = ({ pairType }) => {
  const pair = pairs[pairType];

  if (!pairType) return null;

  const sourceToken: Asset = pair[0];
  const targetToken: Asset = pair[1];

  return (
    <div className="tw-flex tw-items-center tw-select-none">
      <div className="tw-rounded-full tw-z-10">
        <img
          className="tw-w-8 tw-h-8 tw-object-scale-down"
          alt={sourceToken}
          src={AssetsDictionary.get(sourceToken).logoSvg}
        />
      </div>
      <div className="tw-rounded-full tw--ml-3">
        <img
          className="tw-w-8 tw-h-8 tw-object-scale-down"
          alt={targetToken}
          src={AssetsDictionary.get(targetToken).logoSvg}
        />
      </div>

      <div className="tw-font-light text-white tw-ml-2.5">
        <AssetSymbolRenderer asset={Asset[sourceToken]} />
        /
        <AssetSymbolRenderer asset={Asset[targetToken]} />
      </div>
    </div>
  );
};
