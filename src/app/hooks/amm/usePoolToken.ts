import { Asset } from 'types/asset';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { ethGenesisAddress } from '../../../utils/classifiers';

export function usePoolToken(asset: Asset) {
  return useCacheCallWithValue(
    'liquidityProtocol',
    'poolToken',
    ethGenesisAddress,
    getTokenContract(asset).address,
  );
}
