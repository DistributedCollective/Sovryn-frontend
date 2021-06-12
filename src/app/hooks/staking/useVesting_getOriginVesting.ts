import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { ethGenesisAddress } from '../../../utils/classifiers';

export function useVesting_getOriginVesting(address: string) {
  return useCacheCallWithValue(
    'vestingRegistryOrigin',
    'getVesting',
    !!address && address !== ethGenesisAddress,
    address || ethGenesisAddress,
  );
}
