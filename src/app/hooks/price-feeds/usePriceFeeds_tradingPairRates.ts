import { Asset } from 'types/asset';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectWalletProvider } from '../../containers/WalletProvider/selectors';
import { contractReader } from '../../../utils/sovryn/contract-reader';
import { TradingPairDictionary } from '../../../utils/dictionaries/trading-pair-dictionary';

export interface CachedAssetRate {
  source: Asset;
  target: Asset;
  value: {
    precision: string;
    rate: string;
  };
}

export function usePriceFeeds_tradingPairRates() {
  const { syncBlockNumber } = useSelector(selectWalletProvider);

  const [cache, setCache] = useState<CachedAssetRate[]>([]);

  const getRate = useCallback(async (sourceAsset: Asset, destAsset: Asset) => {
    return contractReader.call('priceFeed', 'queryRate', [
      getTokenContract(sourceAsset).address,
      getTokenContract(destAsset).address,
    ]);
  }, []);

  const getRates = useCallback(async () => {
    const pairs = TradingPairDictionary.list();
    const items: CachedAssetRate[] = [];
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const result = await getRate(pair.getAsset(), pair.getLongAsset());
      items.push({
        source: pair.getAsset(),
        target: pair.getLongAsset(),
        value: result as any,
      });
    }
    return items;
  }, [getRate]);

  useEffect(() => {
    getRates().then(setCache).catch(console.error);
  }, [getRates, syncBlockNumber]);

  return cache;
}
