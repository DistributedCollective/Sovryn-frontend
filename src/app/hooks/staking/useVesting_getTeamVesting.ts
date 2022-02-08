import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { ethGenesisAddress } from '../../../utils/classifiers';

export function useVesting_getTeamVesting(address: string) {
  return useCacheCallWithValue(
    'vestingRegistry',
    'getTeamVesting',
    !!address && address !== ethGenesisAddress,
    address || ethGenesisAddress,
    2419200, // 28 days in seconds
    62899200, // 26 * 28 day cycles (~24 months) in seconds
    1, // vesting creation type of team vesting
  );
}
