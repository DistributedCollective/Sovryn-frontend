import React from 'react';
import { Asset } from 'types';

import { TradingTypes } from '../../types';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';

interface IPairLabelProps {
  targetToken: Asset;
  sourceToken: Asset;
  tradeType: TradingTypes;
  className?: string;
}

export const PairLabel: React.FC<IPairLabelProps> = ({
  sourceToken,
  targetToken,
  tradeType,
  className,
}) => {
  return (
    <>
      <AssetSymbolRenderer
        asset={tradeType === TradingTypes.SELL ? sourceToken : targetToken}
        assetClassName={className}
      />
      /
      <AssetSymbolRenderer
        asset={tradeType === TradingTypes.BUY ? sourceToken : targetToken}
        assetClassName={className}
      />
    </>
  );
};
