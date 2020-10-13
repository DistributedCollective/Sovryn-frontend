import { Asset } from 'types/asset';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useLending_tokenPrice(asset: Asset) {
  return useCacheCallWithValue(
    getLendingContractName(asset),
    'tokenPrice',
    '0',
  );
}
