import { useMemo } from 'react';
import { Asset } from 'types/asset';
import { usePriceFeeds_tradingPairRates } from '../price-feeds/usePriceFeeds_tradingPairRates';

export function useCachedAssetPrice(sourceAsset: Asset, destAsset: Asset) {
  const items = usePriceFeeds_tradingPairRates();
  const value = useMemo(() => {
    const item = items.find(
      item => item.source === sourceAsset && item.target === destAsset,
    );
    if (item) {
      return item.value.rate;
    } else {
      return '0';
    }
  }, [items, sourceAsset, destAsset]);
  return { value: value, error: null, loading: false };
}

export function useCachedAssetRate(sourceAsset: Asset, destAsset: Asset) {
  const items = usePriceFeeds_tradingPairRates();
  const value = useMemo(() => {
    if (sourceAsset === destAsset) {
      return { rate: '1', precision: '1' };
    }

    const item = items.find(
      item => item.source === sourceAsset && item.target === destAsset,
    );
    if (item) {
      return item.value;
    } else {
      return { rate: '0', precision: '0' };
    }
  }, [items, sourceAsset, destAsset]);
  return { value: value, error: null, loading: false };
}
