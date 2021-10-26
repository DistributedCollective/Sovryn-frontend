import { useGetContractPastEvents } from 'app/hooks/useGetContractPastEvents';
import { bignumber } from 'mathjs';
import { useMemo } from 'react';

export const useGetTotalLendingRewards = (): string => {
  const { events: lendingRewardEvents } = useGetContractPastEvents(
    'lockedSov',
    'Deposited',
  );

  const totalLendingRewards = useMemo(
    () =>
      lendingRewardEvents
        .map(item => item.returnValues.sovAmount)
        .reduce((prevValue, curValue) => prevValue.add(curValue), bignumber(0)),
    [lendingRewardEvents],
  );

  return totalLendingRewards;
};
