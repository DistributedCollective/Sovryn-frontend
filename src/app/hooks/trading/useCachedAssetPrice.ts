import { useMemo } from 'react';
import { Asset } from 'types/asset';
import { useSelector } from 'react-redux';
import { selectWalletProvider } from '../../containers/WalletProvider/selectors';
import { fixNumber } from '../../../utils/helpers';

export function useCachedAssetPrice(sourceAsset: Asset, destAsset: Asset) {
  const {
    assetRates: items,
    assetRatesLoading,
    assetRatesLoaded,
  } = useSelector(selectWalletProvider);
  const value = useMemo(() => {
    const item = items.find(
      item => item.source === sourceAsset && item.target === destAsset,
    );
    if (item) {
      return fixNumber(item.value.rate);
    } else {
      return '0';
    }
  }, [items, sourceAsset, destAsset]);

  return {
    value: value,
    error: null,
    loading: assetRatesLoading && !assetRatesLoaded,
  };
}

export function useCachedAssetRate(sourceAsset: Asset, destAsset: Asset) {
  const {
    assetRates: items,
    assetRatesLoading,
    assetRatesLoaded,
  } = useSelector(selectWalletProvider);
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
  return {
    value: value,
    error: null,
    loading: assetRatesLoading && !assetRatesLoaded,
  };
}
