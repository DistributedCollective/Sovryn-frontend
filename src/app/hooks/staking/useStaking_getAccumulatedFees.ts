import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { ethGenesisAddress } from '../../../utils/classifiers';

export function useStaking_getAccumulatedFees(address: string, token: string) {
  return useCacheCallWithValue(
    'feeSharingProxy',
    'getAccumulatedFees',
    !!address && address !== ethGenesisAddress,
    address || ethGenesisAddress,
    token || ethGenesisAddress,
  );
}
