import { Asset } from 'types/asset';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useSwapNetwork_reserveStakedBalance(reserveToken: Asset) {
  return useCacheCallWithValue<string[]>(
    'swapNetwork',
    'reserveStakedBalance',
    '0',
    reserveToken,
  );
}
