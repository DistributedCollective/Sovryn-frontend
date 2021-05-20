import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import React from 'react';
import { Asset } from '../../../../../types/asset';

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
  <div className={isProfit ? 'tw-text-tradingLong' : 'tw-text-tradingShort'}>
    {isProfit ? '+ ' : '- '} {amount} <AssetSymbolRenderer asset={asset} />
  </div>
);
