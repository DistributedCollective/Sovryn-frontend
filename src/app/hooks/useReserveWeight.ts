import { useCacheCallWithValue } from '../hooks/useCacheCallWithValue';

export function useReserveWeight(contract, address: string) {
  return useCacheCallWithValue(contract, 'reserveWeight', '0', address);
}
