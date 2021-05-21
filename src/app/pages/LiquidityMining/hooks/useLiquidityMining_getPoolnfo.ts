import { useAccount } from 'app/hooks/useAccount';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';

interface Response {
  poolToken: string;
  allocationPoint: string;
  lastRewardBlock: string;
  accumulatedRewardPerShare: string;
}

export function useLiquidityMining_getPoolInfo(poolToken: string) {
  return useCacheCallWithValue<Response>(
    'liquidityMiningProxy',
    'getPoolInfo',
    {
      amount: '0',
      rewardDebt: '0',
      accumulatedReward: '0',
    },
    poolToken,
    useAccount(),
  );
}
