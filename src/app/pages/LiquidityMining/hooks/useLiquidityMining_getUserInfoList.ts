import { useAccount } from 'app/hooks/useAccount';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';

interface Response {
  amount: string;
  rewardDebt: string;
  accumulatedReward: string;
}

export function useLiquidityMining_getUserInfoList() {
  return useCacheCallWithValue<Response>(
    'liquidityMiningProxy',
    'getUserInfoList',
    {
      amount: '0',
      rewardDebt: '0',
      accumulatedReward: '0',
    },
    useAccount(),
  );
}
