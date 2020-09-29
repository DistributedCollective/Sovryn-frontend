import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useEffectiveTokensRate(
  reserve1Weight: string,
  reserve2Weight: string,
) {
  return useCacheCallWithValue(
    'liquidityProtocol',
    'effectiveReserveWeights',
    ['0', '0'],
    reserve1Weight,
    reserve2Weight,
  );
}
