import { useMemo } from 'react';

import { useGetAvailableLendingRewards } from '../components/RewardTab/hooks/useGetAvailableLendingRewards';
import { useGetAvailableLiquidityRewards } from '../components/RewardTab/hooks/useGetAvailableLiquidityRewards';
import { useGetAvailableTradingRewards } from '../components/RewardTab/hooks/useGetAvailableTradingRewards';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { useAccount } from 'app/hooks/useAccount';

type RewardSovClaimData = {
  availableLendingRewards: string;
  availableTradingRewards: string;
  availableLiquidityRewards: string;
  availableLockedSovBalance: string;
  amountToClaim: string;
};

export const useGetRewardSovClaimAmount = (): RewardSovClaimData => {
  const availableLendingRewards = useGetAvailableLendingRewards();
  const availableTradingRewards = useGetAvailableTradingRewards();
  const availableLiquidityRewards = useGetAvailableLiquidityRewards();
  const address = useAccount();
  const { value: lockedBalance } = useCacheCallWithValue(
    'lockedSov',
    'getLockedBalance',
    '0',
    address,
  );

  const amountToClaim = useMemo(
    () =>
      (
        Number(availableLendingRewards) +
        Number(availableLiquidityRewards) +
        Number(availableTradingRewards) +
        Number(lockedBalance)
      ).toString(),
    [
      availableLendingRewards,
      availableLiquidityRewards,
      availableTradingRewards,
      lockedBalance,
    ],
  );
  return {
    availableLendingRewards: availableLendingRewards,
    availableTradingRewards: availableTradingRewards,
    availableLiquidityRewards: availableLiquidityRewards,
    availableLockedSovBalance: lockedBalance,
    amountToClaim: amountToClaim,
  };
};
