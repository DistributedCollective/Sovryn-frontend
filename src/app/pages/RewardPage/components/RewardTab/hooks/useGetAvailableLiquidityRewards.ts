import { useAccount } from 'app/hooks/useAccount';
import { bignumber } from 'mathjs';
import { useEffect, useState } from 'react';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';

type UserInfo = {
  amount: string;
  rewardDebt: string;
  accumulatedReward: string;
};

export const useGetAvailableLiquidityRewards = (): string => {
  const [liquidityRewards, setLiquidityRewards] = useState({
    accumulatedRewards: '0',
    userRewards: '0',
    lockedRewards: '0',
  });
  const address = useAccount();
  const {
    value: lockedBalance,
    loading: lockedBalanceLoading,
  } = useCacheCallWithValue('lockedSov', 'getLockedBalance', '', address);

  const {
    value: accumulatedRewardsVested,
    loading: accumulatedRewardsVestedLoading,
  } = useCacheCallWithValue(
    'liquidityMiningProxy',
    'getUserAccumulatedRewardToBeVested',
    '',
    address,
  );

  const {
    value: accumulatedRewardsLiquid,
    loading: accumulatedRewardsLiquidLoading,
  } = useCacheCallWithValue(
    'liquidityMiningProxy',
    'getUserAccumulatedRewardToBePaidLiquid',
    '',
    address,
  );

  const { value: infoList, loading: infoListLoading } = useCacheCallWithValue<
    UserInfo[]
  >('liquidityMiningProxy', 'getUserInfoList', '', address);

  useEffect(() => {
    if (!lockedBalanceLoading) {
      setLiquidityRewards(value => ({
        ...value,
        lockedRewards: lockedBalance.toString() || '0',
      }));
    }
  }, [lockedBalance, lockedBalanceLoading]);

  useEffect(() => {
    if (
      !accumulatedRewardsLiquidLoading &&
      !accumulatedRewardsVestedLoading &&
      accumulatedRewardsLiquid &&
      accumulatedRewardsVested
    ) {
      setLiquidityRewards(value => ({
        ...value,
        accumulatedRewards: bignumber(accumulatedRewardsLiquid)
          .add(accumulatedRewardsVested)
          .toString(),
      }));
    }
  }, [
    accumulatedRewardsLiquid,
    accumulatedRewardsLiquidLoading,
    accumulatedRewardsVested,
    accumulatedRewardsVestedLoading,
  ]);

  useEffect(() => {
    if (!infoListLoading) {
      const userRewards =
        infoList && infoList.length > 0
          ? infoList
              .map(item => item?.accumulatedReward)
              .reduce((a, b) => bignumber(a).add(b).toString(), '0')
          : '0';

      setLiquidityRewards(value => ({
        ...value,
        userRewards,
      }));
    }
  }, [infoList, infoListLoading, lockedBalance]);

  return bignumber(liquidityRewards.accumulatedRewards)
    .add(liquidityRewards.userRewards)
    .add(liquidityRewards.lockedRewards)
    .toString();
};
