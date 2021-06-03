import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { ethGenesisAddress } from '../../../utils/classifiers';

export function useStaking_getCurrentVotes(address: string) {
  return useCacheCallWithValue(
    'staking',
    'getCurrentVotes',
    !!address && address !== ethGenesisAddress,
    address || ethGenesisAddress,
  );
}
