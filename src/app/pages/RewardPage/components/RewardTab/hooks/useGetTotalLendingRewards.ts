import { useMemo } from 'react';
import { bignumber } from 'mathjs';

import { useGetContractPastEvents } from 'app/hooks/useGetContractPastEvents';
import { LendingPoolDictionary } from 'utils/dictionaries/lending-pool-dictionary';

const lendPools = LendingPoolDictionary.list().map(
  value => value.getAssetDetails().lendingContract.address,
);

export const useGetTotalLendingRewards = (): string => {
  const { events: lendingRewardEvents } = useGetContractPastEvents(
    'liquidityMiningProxy',
    'RewardClaimed',
  );

  const totalLendingRewards = useMemo(
    () =>
      lendingRewardEvents
        .filter(item => lendPools.includes(item.returnValues.poolToken))
        .map(item => item.returnValues.amount)
        .reduce((prevValue, curValue) => prevValue.add(curValue), bignumber(0)),
    [lendingRewardEvents],
  );

  return totalLendingRewards;
};
