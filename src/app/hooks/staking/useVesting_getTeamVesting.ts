import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { ethGenesisAddress } from '../../../utils/classifiers';

export function useVesting_getTeamVesting(address: string) {
  return useCacheCallWithValue(
    'vestingRegistry',
    'getTeamVesting',
    ethGenesisAddress,
    !!address && address !== ethGenesisAddress,
    address || ethGenesisAddress,
  );
}
