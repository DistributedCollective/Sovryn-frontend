import { useAccount } from 'app/hooks/useAccount';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';

export function useLiquidityMining_getUserAccumulatedReward(poolToken: string) {
  return useCacheCallWithValue(
    'liquidityMiningProxy',
    'getUserAccumulatedReward',
    '0',
    poolToken,
    useAccount(),
  );
}
