import { useAccount } from 'app/hooks/useAccount';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { bignumber } from 'mathjs';
import { useEffect, useState } from 'react';
import { Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { ethGenesisAddress } from 'utils/classifiers';
import { LiquidityPoolDictionary } from 'utils/dictionaries/liquidity-pool-dictionary';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';

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

  useEffect(() => {
    if (!lockedBalanceLoading) {
      setLiquidityRewards(value => ({
        ...value,
        lockedRewards: lockedBalance.toString() || '0',
      }));
    }
  }, [lockedBalance, lockedBalanceLoading]);

  useEffect(() => {
    const ammPools = LiquidityPoolDictionary.list().filter(
      item => item.hasSovRewards,
    );
    if (address !== '' && address !== ethGenesisAddress) {
      const pools = ammPools.flatMap(item =>
        item.converterVersion === 1
          ? [item.poolTokenA]
          : [item.poolTokenA, item.poolTokenB],
      );
      bridgeNetwork
        .multiCall(
          Chain.RSK,
          pools.flatMap((item, index) => {
            return [
              {
                address: getContract('liquidityMiningProxy').address,
                abi: getContract('liquidityMiningProxy').abi,
                fnName: 'getUserAccumulatedReward',
                args: [item, address],
                key: `getUserAccumulatedReward_${item}`,
                parser: value => value[0].toString(),
              },
            ];
          }),
        )
        .then(result => {
          const total = Object.values(result.returnData).reduce(
            (previousValue, currentValue) => previousValue.add(currentValue),
            bignumber(0),
          );
          setLiquidityRewards(value => ({
            ...value,
            accumulatedRewards: total.toString(),
          }));
        })
        .catch(error => {
          console.error('e', error);
        });

      bridgeNetwork
        .multiCall(
          Chain.RSK,
          pools.flatMap(item => {
            return [
              {
                address: getContract('liquidityMiningProxy').address,
                abi: getContract('liquidityMiningProxy').abi,
                fnName: 'getUserInfo',
                args: [item, address],
                key: `getUserInfo_${item}`,
                parser: value => value[0].accumulatedReward.toString(),
              },
            ];
          }),
        )
        .then(result => {
          const total = Object.values(result.returnData).reduce(
            (prevValue, currValue) => prevValue.add(currValue),
            bignumber(0),
          );
          setLiquidityRewards(value => ({
            ...value,
            userRewards: total.toString(),
          }));
        })
        .catch(error => {
          console.error('e', error);
        });
    }
  }, [address]);

  return bignumber(liquidityRewards.accumulatedRewards)
    .add(liquidityRewards.userRewards)
    .add(liquidityRewards.lockedRewards)
    .toString();
};
