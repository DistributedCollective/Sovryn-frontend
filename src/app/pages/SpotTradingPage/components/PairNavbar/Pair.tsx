import React, { useMemo } from 'react';
import { pairs, SpotPairType } from '../../types';
import { Asset } from 'types/asset';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';

interface IPair {
  pairType: SpotPairType;
}

export const Pair: React.FC<IPair> = ({ pairType }) => {
  const pair = pairs[pairType];

  const sourceToken = pair[0];
  const targetToken = pair[1];

  const sourceTokenLogo = useMemo(
    () => AssetsDictionary.get(sourceToken).logoSvg,
    [sourceToken],
  );
  const targetTokenLogo = useMemo(
    () => AssetsDictionary.get(targetToken).logoSvg,
    [targetToken],
  );

  if (!pairType) {
    return null;
  }

  return (
    <div className="tw-flex tw-items-center tw-select-none">
      <div className="tw-rounded-full tw-z-10">
        <img
          className="tw-w-8 tw-h-8 tw-object-scale-down"
          alt={sourceToken}
          src={sourceTokenLogo}
        />
      </div>
      <div className="tw-rounded-full tw--ml-3">
        <img
          className="tw-w-8 tw-h-8 tw-object-scale-down"
          alt={targetToken}
          src={targetTokenLogo}
        />
      </div>

      <div
        className="tw-font-light text-white tw-ml-2.5 tw-flex"
        data-action-id="spot-select-pair"
      >
        <div data-action-id="spot-select-asset-selector1">
          <AssetSymbolRenderer asset={Asset[sourceToken]} />
        </div>
        /
        <div data-action-id="spot-select-asset-selector1">
          <AssetSymbolRenderer asset={Asset[targetToken]} />
        </div>
      </div>
    </div>
  );
};
