import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { ethGenesisAddress } from '../../../utils/classifiers';

export function useVesting_getFourYearVesting(address: string) {
  return useCacheCallWithValue(
    'vestingRegistry',
    'getVestingAddr',
    !!address && address !== ethGenesisAddress,
    address || ethGenesisAddress,
    2419200, // 28 days in seconds
    94348800, // 39 * 28 day cycles (~36 months) in seconds
    4, // vesting creation type of Four-Year vesting
  );
}
