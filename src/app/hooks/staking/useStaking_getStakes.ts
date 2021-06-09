import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { ethGenesisAddress } from '../../../utils/classifiers';

export function useStaking_getStakes(address: string) {
  return useCacheCallWithValue(
    'staking',
    'getStakes',
    !!address && address !== ethGenesisAddress,
    address || ethGenesisAddress,
  );
}
