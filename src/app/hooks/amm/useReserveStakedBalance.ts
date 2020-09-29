import { Asset } from 'types/asset';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useReserveStakedBalance(asset: Asset) {
  return useCacheCallWithValue(
    'liquidityProtocol',
    'reserveStakedBalance',
    '0',
    getTokenContract(asset).address,
  );
}
