import { useAccount } from 'app/hooks/useAccount';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { bignumber } from 'mathjs';
import { useEffect, useState } from 'react';
import { Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { LendingPoolDictionary } from 'utils/dictionaries/lending-pool-dictionary';

export const useGetAvailableLendingRewards = (): string => {
  const [lendingRewards, setLendingRewards] = useState('0');
  const address = useAccount();

  useEffect(() => {
    const lendingPools = LendingPoolDictionary.list().filter(
      item => item.useLM,
    );

    bridgeNetwork
      .multiCall<{ [key: string]: string }>(
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
  }, [address]);

  return lendingRewards;
};
