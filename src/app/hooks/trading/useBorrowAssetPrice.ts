import { Asset } from 'types/asset';
import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { getTokenContract } from '../../../utils/blockchain/contract-helpers';

export function useBorrowAssetPrice(sourceAsset: Asset, destAsset: Asset) {
  const result = useCacheCallWithValue(
    'priceFeed',
    'queryRate',
    '0',
    getTokenContract(sourceAsset).address,
    getTokenContract(destAsset).address,
  );
  return {
    ...result,
    value: result.value?.rate || '0',
  };
}
