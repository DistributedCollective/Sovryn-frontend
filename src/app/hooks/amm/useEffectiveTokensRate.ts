import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useEffectiveTokensRate(numerator: string, denominator: string) {
  return useCacheCallWithValue(
    'liquidityProtocol',
    'effectiveTokensRate',
    ['0', '0'],
    numerator,
    denominator,
  );
}
