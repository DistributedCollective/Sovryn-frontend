import { useCacheCallWithValue } from '../useCacheCallWithValue';

/**
 * @deprecated
 */
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
