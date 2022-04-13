import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { ethGenesisAddress } from '../../../utils/classifiers';
import { getFeeSharingProxyContractName } from 'utils/blockchain/requests/staking';

export function useStaking_getAccumulatedFees(
  address: string,
  token: string,
  useNewContract = false,
) {
  return useCacheCallWithValue(
    getFeeSharingProxyContractName(useNewContract),
    'getAccumulatedFees',
    '0',
    address || ethGenesisAddress,
    token || ethGenesisAddress,
  );
}
