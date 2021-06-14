import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useStaking_WEIGHT_FACTOR() {
  return useCacheCallWithValue('staking', 'WEIGHT_FACTOR', '0');
}
