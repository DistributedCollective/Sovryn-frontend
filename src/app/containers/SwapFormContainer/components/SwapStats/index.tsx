import React from 'react';
import {
  IPairsData,
  IAssets,
} from 'app/pages/LandingPage/components/CryptocurrencyPrices/types';
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
