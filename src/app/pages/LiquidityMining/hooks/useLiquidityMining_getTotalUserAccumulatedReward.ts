import { bignumber } from 'mathjs';
import { useLiquidityMining_getUserInfo } from './useLiquidityMining_getUserInfo';
import { useLiquidityMining_getUserAccumulatedReward } from './useLiquidityMining_getUserAccumulatedReward';

export function useLiquidityMining_getTotalUserAccumulatedReward(
  poolToken: string,
) {
  const info = useLiquidityMining_getUserInfo(poolToken);
  const reward = useLiquidityMining_getUserAccumulatedReward(poolToken);

  return {
    value: bignumber(info.value?.accumulatedReward || '0')
      .add(reward.value)
      .toFixed(0),
    loading: info.loading || reward.loading,
    error: info.error || reward.error,
  };
}
