import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import React from 'react';
import { Asset } from '../../../../../types';

interface IProfitLossRendererProps {
  isProfit: boolean;
  amount: string;
  asset: Asset;
}

export const ProfitLossRenderer: React.FC<IProfitLossRendererProps> = ({
  isProfit,
  amount,
  asset,
}) => (
  <div className={isProfit ? 'tw-text-trade-long' : 'tw-text-trade-short'}>
    {isProfit ? '+ ' : '- '} {amount} <AssetSymbolRenderer asset={asset} />
  </div>
);
