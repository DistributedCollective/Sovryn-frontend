import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useLiquidationLimit(poolTokenAddress: string) {
  return useCacheCallWithValue(
    'liquidityProtocol',
    'liquidationLimit',
    '0',
    poolTokenAddress,
  );
}
