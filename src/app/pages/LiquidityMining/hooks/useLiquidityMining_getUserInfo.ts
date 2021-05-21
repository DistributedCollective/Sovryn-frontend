import { useAccount } from 'app/hooks/useAccount';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';

interface Response {
  amount: string;
  rewardDebt: string;
  accumulatedReward: string;
}

export function useLiquidityMining_getUserInfo(poolToken: string) {
  return useCacheCallWithValue<Response>(
    'liquidityMiningProxy',
    'getUserInfo',
    {
      amount: '0',
      rewardDebt: '0',
      accumulatedReward: '0',
    },
    poolToken,
    useAccount(),
  );
}
