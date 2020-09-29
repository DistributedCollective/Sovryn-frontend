import { Asset } from 'types/asset';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useReserveAmplifiedBalance(token: Asset) {
  return useCacheCallWithValue(
    'liquidityProtocol',
    'reserveAmplifiedBalance',
    '0',
    getTokenContract(token).address,
  );
}
