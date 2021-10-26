import { useGetContractPastEvents } from 'app/hooks/useGetContractPastEvents';
import { bignumber } from 'mathjs';
import { useMemo } from 'react';

export const useGetTotalLiquidityRewards = (): string => {
  const { events: liquidityRewardsEvents } = useGetContractPastEvents(
    'liquidityMiningProxy',
    'RewardClaimed',
  );

  const totalLiquidityRewards = useMemo(
    () =>
      liquidityRewardsEvents
        .map(item => item.returnValues.amount)
        .reduce((prevValue, curValue) => prevValue.add(curValue), bignumber(0)),
    [liquidityRewardsEvents],
  );

  return totalLiquidityRewards;
};
