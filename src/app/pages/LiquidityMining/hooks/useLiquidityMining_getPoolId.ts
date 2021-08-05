import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';

export function useLiquidityMining_getPoolId(poolToken: string) {
  return useCacheCallWithValue(
    'liquidityMiningProxy',
    'getPoolId',
    '0',
    poolToken,
  );
}
