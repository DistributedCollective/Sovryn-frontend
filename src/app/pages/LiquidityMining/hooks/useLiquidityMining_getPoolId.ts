import { useAccount } from 'app/hooks/useAccount';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';

interface Response {
  poolToken: string;
  allocationPoint: string;
  lastRewardBlock: string;
  accumulatedRewardPerShare: string;
}

export function useLiquidityMining_getPoolId(poolToken: string) {
  return useCacheCallWithValue(
    'liquidityMiningProxy',
    'getPoolId',
    '0',
    poolToken,
  );
}
