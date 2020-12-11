import { useEffect, useState } from 'react';
import { Asset } from 'types/asset';
import { usePriceFeeds_tradingPairRates } from '../price-feeds/usePriceFeeds_tradingPairRates';

export function useCachedAssetPrice(sourceAsset: Asset, destAsset: Asset) {
  const items = usePriceFeeds_tradingPairRates();

  const [value, setValue] = useState('0');

  useEffect(() => {
    const item = items.find(
      item => item.source === sourceAsset && item.target === destAsset,
    );
    if (item) {
      setValue(item.value.rate);
    } else {
      setValue('0');
    }
  }, [items, sourceAsset, destAsset]);

  return { value: value, error: null, loading: false };
}
