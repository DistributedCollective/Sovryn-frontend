import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { ethGenesisAddress } from '../../../utils/classifiers';
import { getFeeSharingProxyContractName } from 'utils/blockchain/requests/staking';

export function useStaking_getAccumulatedFees(
  address: string,
  token: string,
  useNewContract = false,
  startFrom?: number,
  maxCheckpoints?: number,
) {
  return useCacheCallWithValue(
    getFeeSharingProxyContractName(useNewContract),
    'getAccumulatedFeesForCheckpointsRange',
    '0',
    address || ethGenesisAddress,
    token || ethGenesisAddress,
    startFrom || 0,
    maxCheckpoints || 0,
  );
}
