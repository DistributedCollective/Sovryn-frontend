import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { ethGenesisAddress } from '../../../utils/classifiers';

export function useStaking_balanceOf(address: string) {
  return useCacheCallWithValue(
    'staking',
    'balanceOf',
    !!address && address !== ethGenesisAddress,
    address || ethGenesisAddress,
  );
}
