import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { ethGenesisAddress } from '../../../utils/classifiers';

export function useStaking_getAccumulatedFees(
  address: string,
  token: string,
  useNewContract = false,
) {
  return useCacheCallWithValue(
    useNewContract ? 'feeSharingProxy' : 'feeSharingProxy_old',
    'getAccumulatedFees',
    !!address && address !== ethGenesisAddress,
    address || ethGenesisAddress,
    token || ethGenesisAddress,
  );
}
