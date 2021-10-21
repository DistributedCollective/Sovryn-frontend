import { useMemo } from 'react';
import { bignumber } from 'mathjs';

import { useGetContractPastEvents } from 'app/hooks/useGetContractPastEvents';
import { LiquidityPoolDictionary } from 'utils/dictionaries/liquidity-pool-dictionary';
import { currentNetwork } from 'utils/classifiers';

const liquidityPools = LiquidityPoolDictionary.list().map(
  pool => pool.supplyAssets[0].poolTokens[currentNetwork],
);

export const useGetTotalLiquidityRewards = (): string => {
  const { events: liquidityRewardsEvents } = useGetContractPastEvents(
    'liquidityMiningProxy',
    'RewardClaimed',
  );

  const totalLiquidityRewards = useMemo(
    () =>
      liquidityRewardsEvents
        .filter(item => liquidityPools.includes(item.returnValues.poolToken))
        .map(item => item.returnValues.amount)
        .reduce((prevValue, curValue) => prevValue.add(curValue), bignumber(0)),
    [liquidityRewardsEvents],
  );

  return totalLiquidityRewards;
};
