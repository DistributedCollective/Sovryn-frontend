import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useMaxSwapSize() {
  return useCacheCallWithValue('sovrynProtocol', 'maxSwapSize', '0');
}
