import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useSwapNetwork_conversionPath(
  sourceToken: string,
  targetToken: string,
) {
  return useCacheCallWithValue<string[]>(
    'swapNetwork',
    'conversionPath',
    [],
    sourceToken,
    targetToken,
  );
}
