import { useGetContractPastEvents } from 'app/hooks/useGetContractPastEvents';
import { bignumber } from 'mathjs';
import { useMemo } from 'react';

export const useGetTotalTradingRewards = (): string => {
  const { events: tradingRewardsEvents } = useGetContractPastEvents(
    'sovrynProtocol',
    'EarnReward',
  );

  const totalTradingRewards = useMemo(
    () =>
      tradingRewardsEvents
        .map(item => item.returnValues.amount)
        .reduce((prevValue, curValue) => prevValue.add(curValue), bignumber(0)),
    [tradingRewardsEvents],
  );

  return totalTradingRewards;
};
