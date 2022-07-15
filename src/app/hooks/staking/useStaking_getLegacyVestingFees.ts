import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { ethGenesisAddress } from '../../../utils/classifiers';
import { getFeeSharingProxyContractName } from 'utils/blockchain/requests/staking';

export function useStaking_getLegacyVestingFees(
  vestAddress: string,
  token: string,
) {
  return useCacheCallWithValue(
    getFeeSharingProxyContractName(false),
    'getAccumulatedFees',
    '0',
    vestAddress || ethGenesisAddress,
    token || ethGenesisAddress,
  );
}
