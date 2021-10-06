import { useMemo } from 'react';
// import { bignumber } from 'mathjs';
// import { weiTo18 } from 'utils/blockchain/math-helpers';
import { useGetAvailableLendingRewards } from '../components/RewardTab/hooks/useGetAvailableLendingRewards';
import { useGetAvailableLiquidityRewards } from '../components/RewardTab/hooks/useGetAvailableLiquidityRewards';
import { useGetAvailableTradingRewards } from '../components/RewardTab/hooks/useGetAvailableTradingRewards';

type RewardSovClaimData = {
  availableLendingRewards: string;
  availableTradingRewards: string;
  availableLiquidityRewards: string;
  amountToClaim: string;
};

export const useGetRewardSovClaimAmount = (): RewardSovClaimData => {
  const availableLendingRewards = useGetAvailableLendingRewards();
  const availableTradingRewards = useGetAvailableTradingRewards();
  const availableLiquidityRewards = useGetAvailableLiquidityRewards();
  // bignumber(useGetAvailableLiquidityRewards())
  //   .mul(10 ** 4)
  //   .toFixed();

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
