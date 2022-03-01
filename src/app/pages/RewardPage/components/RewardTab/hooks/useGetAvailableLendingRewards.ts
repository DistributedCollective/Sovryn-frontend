import { useAccount } from 'app/hooks/useAccount';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { bignumber } from 'mathjs';
import { useEffect, useState } from 'react';
import { Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { LendingPoolDictionary } from 'utils/dictionaries/lending-pool-dictionary';
import { useLiquidityMining_getUserInfoList } from 'app/pages/LiquidityMining/hooks/useLiquidityMining_getUserInfoList';

export const useGetAvailableLendingRewards = (): string => {
  const [recentRewards, setRecentRewards] = useState('0');
  const [lendingRewards, setLendingRewards] = useState('0');
  const address = useAccount();
  const {
    value: userInfoList,
    loading: userInfoListLoading,
  } = useLiquidityMining_getUserInfoList();

  useEffect(() => {
    if (userInfoListLoading !== false || userInfoList.length === 0) return;

    const lendingPools = LendingPoolDictionary.list().filter(
      item => item.useLM,
    );

    bridgeNetwork
      .multiCall(
        Chain.RSK,
        lendingPools.flatMap((item, index) => {
          return [
            {
              address: getContract('liquidityMiningProxy').address,
              abi: getContract('liquidityMiningProxy').abi,
              fnName: 'getPoolId',
              args: [item.getAssetDetails().lendingContract.address],
              key: item.getAsset(),
              parser: value => value[0].toString(),
            },
          ];
        }),
      )
      .then(result => {
        const recent = Object.entries(result.returnData).reduce(
          (previous, current) => previous.add(userInfoList[current[1]][2]),
          bignumber(0),
        );
        setRecentRewards(recent.toString());
      })
      .catch(error => {
        console.error('e', error);
      });

    bridgeNetwork
      .multiCall(
        Chain.RSK,
        lendingPools.flatMap((item, index) => {
          return [
            {
              address: getContract('liquidityMiningProxy').address,
              abi: getContract('liquidityMiningProxy').abi,
              fnName: 'getUserAccumulatedReward',
              args: [item.getAssetDetails().lendingContract.address, address],
              key: `getUserAccumulatedReward_${index}_${item.getAsset}`,
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
        setLendingRewards(total.toString());
      })
      .catch(error => {
        console.error('e', error);
      });
  }, [address, userInfoList, userInfoListLoading]);

  return bignumber(lendingRewards).add(recentRewards).toString();
};
