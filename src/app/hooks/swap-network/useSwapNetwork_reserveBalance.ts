import { Asset } from 'types/asset';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useSwapNetwork_reserveBalance(primaryReserveToken: Asset) {
  return useCacheCallWithValue<string[]>(
    'swapNetwork',
    'reserveBalance',
    '0',
    primaryReserveToken,
  );
}
