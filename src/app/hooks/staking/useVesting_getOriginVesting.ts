import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { ethGenesisAddress } from '../../../utils/classifiers';

export function useVesting_getOriginVesting(address: string) {
  return useCacheCallWithValue(
    'vestingRegistry2',
    'getVesting',
    ethGenesisAddress,
    !!address && address !== ethGenesisAddress,
    address || ethGenesisAddress,
  );
}
