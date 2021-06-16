import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { ethGenesisAddress } from '../../../utils/classifiers';

export function useVesting_getRewards(address: string) {
  return useCacheCallWithValue(
    'vestingRegistryLM',
    'getVesting',
    !!address && address !== ethGenesisAddress,
    address || ethGenesisAddress,
  );
}
