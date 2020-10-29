import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useSwapNetwork_conversionPath(
  sourceToken: string,
  targetToken: string,
) {
  return useCacheCallWithValue(
    'swapNetwork',
    'conversionPath',
    [],
    sourceToken,
    targetToken,
  );
}
