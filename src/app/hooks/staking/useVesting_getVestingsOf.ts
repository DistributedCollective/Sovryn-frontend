import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { ethGenesisAddress } from '../../../utils/classifiers';

interface Value {
  [index: number]: {
    vestingAddress: string;
    vestingCreationType: string;
    vestingType: string;
  };
}

export function useVesting_getVestingsOf(address: string) {
  return useCacheCallWithValue<Value>(
    'vestingRegistry',
    'getVestingsOf',
    !!address && address !== ethGenesisAddress,
    address || ethGenesisAddress,
  );
}
