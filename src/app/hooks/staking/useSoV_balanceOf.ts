import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { ethGenesisAddress } from '../../../utils/classifiers';

export function useSoV_balanceOf(address: string) {
  return useCacheCallWithValue(
    'sovToken',
    'balanceOf',
    !!address && address !== ethGenesisAddress,
    address || ethGenesisAddress,
  );
}
