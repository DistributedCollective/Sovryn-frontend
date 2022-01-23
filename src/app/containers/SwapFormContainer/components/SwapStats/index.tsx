import React from 'react';
import { IAssets } from 'app/pages/LandingPage/components/CryptocurrencyPrices/types';
import { IPairsData } from 'types/trading-pairs';
import { SwapStatsPrices } from './components/SwapStatsPrices';
interface ISwapStatsProps {
  pairsData: IPairsData;
  assetData: IAssets;
}

export const SwapStats: React.FC<ISwapStatsProps> = ({
  pairsData,
  assetData,
}) => {
  return <SwapStatsPrices pairs={pairsData.pairs} assetData={assetData} />;
};
