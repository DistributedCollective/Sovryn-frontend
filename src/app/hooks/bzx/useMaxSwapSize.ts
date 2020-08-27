import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useMaxSwapSize() {
  return useCacheCallWithValue('bzxContract', 'maxSwapSize', '0');
}
