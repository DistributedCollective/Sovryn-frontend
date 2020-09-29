import { Asset } from 'types/asset';
import { getTokenContractName } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

/**
 * Total supply of selected tokens.
 * @param asset
 */
export function useTokenSupply(asset: Asset) {
  return useCacheCallWithValue(getTokenContractName(asset), 'totalSupply', '0');
}
