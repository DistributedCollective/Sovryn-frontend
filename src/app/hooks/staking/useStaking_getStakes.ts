import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { ethGenesisAddress } from '../../../utils/classifiers';

interface Value {
  0: string[];
  1: string[];
  dates: string[];
  stakes: string[];
}

export function useStaking_getStakes(address: string) {
  return useCacheCallWithValue<Value>(
    'staking',
    'getStakes',
    !!address && address !== ethGenesisAddress,
    address || ethGenesisAddress,
  );
}
