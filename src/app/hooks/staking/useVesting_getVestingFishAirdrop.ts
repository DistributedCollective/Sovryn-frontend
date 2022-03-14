import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { ethGenesisAddress } from '../../../utils/classifiers';

export function useVesting_getVestingFishAirdrop(address: string) {
  return useCacheCallWithValue(
    'vestingRegistryFISH',
    'getTeamVesting',
    !!address && address !== ethGenesisAddress,
    address || ethGenesisAddress,
  );
}
