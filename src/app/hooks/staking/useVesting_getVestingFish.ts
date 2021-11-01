import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { ethGenesisAddress } from '../../../utils/classifiers';

export function useVesting_getVestingFish(address: string) {
  return useCacheCallWithValue(
    'vestingRegistryFISH',
    'getVesting',
    !!address && address !== ethGenesisAddress,
    address || ethGenesisAddress,
  );
}
