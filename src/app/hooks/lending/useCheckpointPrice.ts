import { Asset } from 'types/asset';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useCheckpointPrice(asset: Asset) {
  return useCacheCallWithValue(
    getLendingContractName(asset),
    'checkpointPrice',
    '0',
  );
}
