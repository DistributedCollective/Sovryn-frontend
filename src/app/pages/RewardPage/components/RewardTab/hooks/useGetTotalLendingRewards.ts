import { useMemo } from 'react';
import { bignumber } from 'mathjs';

import { useGetContractPastEvents } from 'app/hooks/useGetContractPastEvents';
import { lendingPools } from 'app/pages/RewardPage/helpers';

export const useGetTotalLendingRewards = (): string => {
  const { events: lendingRewardEvents } = useGetContractPastEvents(
    'liquidityMiningProxy',
    'RewardClaimed',
  );

  const totalLendingRewards = useMemo(
    () =>
      lendingRewardEvents
        .filter(item =>
          lendingPools.includes(item.returnValues.poolToken?.toLowerCase()),
        )
        .map(item => item.returnValues.amount)
        .reduce((prevValue, curValue) => prevValue.add(curValue), bignumber(0)),
    [lendingRewardEvents],
  );

  return totalLendingRewards;
};
