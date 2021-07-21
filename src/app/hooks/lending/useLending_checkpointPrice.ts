import { Asset } from 'types/asset';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useLending_checkpointPrice(asset: Asset, address: string) {
  return useCacheCallWithValue(
    getLendingContractName(asset),
    'checkpointPrice',
    '0',
    address,
  );
}
