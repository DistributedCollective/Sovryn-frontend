import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import React from 'react';
import { Asset } from 'types';

interface ITopInfoContent {
  amount: string;
  asset: Asset;
  isApproximation?: boolean;
}

export const TopInfoContent: React.FC<ITopInfoContent> = ({
  amount,
  asset,
  isApproximation = false,
}: ITopInfoContent) => (
  <div className="tw-text-2xl tw-font-medium tw-tracking-normal tw-pt-1">
    {isApproximation && '≈'} {amount} <AssetSymbolRenderer asset={asset} />
  </div>
);
