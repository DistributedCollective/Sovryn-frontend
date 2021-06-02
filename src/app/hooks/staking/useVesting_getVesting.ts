import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { ethGenesisAddress } from '../../../utils/classifiers';

export function useVesting_getVesting(address: string) {
  return useCacheCallWithValue(
    'vestingRegistry',
    'getVesting',
    !!address && address !== ethGenesisAddress,
    address || ethGenesisAddress,
  );
}
