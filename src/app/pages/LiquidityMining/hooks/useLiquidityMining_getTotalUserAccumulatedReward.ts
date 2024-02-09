import { useLiquidityMining_getUserAccumulatedReward } from './useLiquidityMining_getUserAccumulatedReward';

export function useLiquidityMining_getTotalUserAccumulatedReward(
  poolToken: string,
) {
  const reward = useLiquidityMining_getUserAccumulatedReward(poolToken);

  return {
    value: reward.value,
    loading: reward.loading,
    error: reward.error,
  };
}
