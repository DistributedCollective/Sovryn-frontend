import { Asset } from 'types/asset';
import { usePriceFeeds_QueryRate } from '../price-feeds/useQueryRate';

export function useBorrowAssetPrice(sourceAsset: Asset, destAsset: Asset) {
  const { value, ...result } = usePriceFeeds_QueryRate(sourceAsset, destAsset);
  return {
    ...result,
    value: value?.rate || '0',
  };
}
