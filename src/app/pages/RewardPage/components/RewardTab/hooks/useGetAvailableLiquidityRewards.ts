import { useAccount } from 'app/hooks/useAccount';
import { bignumber } from 'mathjs';
import { useEffect, useMemo, useState } from 'react';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';

type UserInfo = {
  amount: string;
  rewardDebt: string;
  accumulatedReward: string;
};

type LiquidityRewardsData = {
  availableLiquidityRewardsVested: string;
  availableLiquidityRewardsLiquid: string;
};

export const useGetAvailableLiquidityRewards = (): LiquidityRewardsData => {
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

  const { value: accumulatedRewardsLiquid } = useCacheCallWithValue(
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
    if (!accumulatedRewardsVestedLoading && accumulatedRewardsVested) {
      setLiquidityRewards(value => ({
        ...value,
        accumulatedRewards: accumulatedRewardsVested.toString() || '0',
      }));
    }
  }, [accumulatedRewardsVested, accumulatedRewardsVestedLoading]);

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

  const availableLiquidityRewardsVested = useMemo(
    () =>
      bignumber(liquidityRewards.accumulatedRewards)
        .add(liquidityRewards.userRewards)
        .add(liquidityRewards.lockedRewards)
        .toString(),
    [
      liquidityRewards.accumulatedRewards,
      liquidityRewards.lockedRewards,
      liquidityRewards.userRewards,
    ],
  );

  const availableLiquidityRewardsLiquid = useMemo(
    () =>
      !accumulatedRewardsVestedLoading && accumulatedRewardsLiquid
        ? accumulatedRewardsLiquid.toString()
        : '0',
    [accumulatedRewardsLiquid, accumulatedRewardsVestedLoading],
  );

  return {
    availableLiquidityRewardsVested,
    availableLiquidityRewardsLiquid,
  };
};
