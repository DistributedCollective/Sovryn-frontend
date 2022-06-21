import React, { useMemo } from 'react';
import {
  pairs as spotPairs,
  SpotPairType,
} from 'app/pages/SpotTradingPage/types';
import {
  pairs as marginPairs,
  TradingPairType,
} from 'utils/dictionaries/trading-pair-dictionary';
import { Asset } from 'types/asset';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { TradingType } from 'types/trading-pairs';

interface IPairProps {
  tradingType: SpotPairType | TradingPairType;
  type: string;
}

export const Pair: React.FC<IPairProps> = ({ tradingType, type }) => {
  const pair =
    type === TradingType.SPOT
      ? spotPairs[tradingType]
      : marginPairs[tradingType];
  const [sourceToken, targetToken] = pair;

  const sourceTokenLogo = useMemo(
    () => AssetsDictionary.get(sourceToken).logoSvg,
    [sourceToken],
  );
  const targetTokenLogo = useMemo(
    () => AssetsDictionary.get(targetToken).logoSvg,
    [targetToken],
  );

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

      <div className="tw-font-light text-white tw-ml-2.5 tw-flex">
        <div data-action-id={`${type}-select-asset-${Asset[targetToken]}`}>
          <AssetSymbolRenderer asset={Asset[sourceToken]} />
        </div>
        /
        <div data-action-id={`${type}-select-asset-${Asset[targetToken]}`}>
          <AssetSymbolRenderer asset={Asset[targetToken]} />
        </div>
      </div>
    </div>
  );
};
