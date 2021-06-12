import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useStaking_kickoffTs() {
  return useCacheCallWithValue('staking', 'kickoffTS', '0');
}
