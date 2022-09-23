import { useMemo } from 'react';
import { toWei } from 'utils/blockchain/math-helpers';
import { useGetAvailableLendingRewards } from '../components/RewardTab/hooks/useGetAvailableLendingRewards';
import { useGetAvailableLiquidityRewards } from '../components/RewardTab/hooks/useGetAvailableLiquidityRewards';
import { useGetTradingRewards } from '../components/RewardTab/hooks/useGetTradingRewards';

type RewardSovClaimData = {
  availableLendingRewards: string;
  availableTradingRewards: string;
  availableLiquidityRewards: string;
  amountToClaim: string;
};

export const useGetRewardSovClaimAmount = (): RewardSovClaimData => {
  const availableLendingRewards = useGetAvailableLendingRewards();
  const { data: availableTradingRewardsData } = useGetTradingRewards();
  const availableLiquidityRewards = useGetAvailableLiquidityRewards();

  const availableTradingRewards = useMemo(
    () =>
      toWei(
        availableTradingRewardsData?.userRewardsEarnedHistory
          ?.availableTradingRewards || '0',
      ),
    [availableTradingRewardsData],
  );

  const amountToClaim = useMemo(
    () =>
      (
        Number(availableLendingRewards) +
        Number(availableLiquidityRewards) +
        Number(availableTradingRewards)
      ).toString(),
    [
      availableLendingRewards,
      availableLiquidityRewards,
      availableTradingRewards,
    ],
  );

  return {
    availableLendingRewards: availableLendingRewards,
    availableTradingRewards: availableTradingRewards,
    availableLiquidityRewards: availableLiquidityRewards,
    amountToClaim: amountToClaim,
  };
};
