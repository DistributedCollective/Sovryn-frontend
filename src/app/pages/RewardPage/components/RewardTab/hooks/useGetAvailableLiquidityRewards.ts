import { useAccount } from 'app/hooks/useAccount';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { bignumber } from 'mathjs';
import { useEffect, useState } from 'react';
import { Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { ethGenesisAddress } from 'utils/classifiers';
import { LiquidityPoolDictionary } from 'utils/dictionaries/liquidity-pool-dictionary';

export const useGetAvailableLiquidityRewards = (): string => {
  const [liquidityRewards, setLiquidityRewards] = useState('0');
  const address = useAccount();

  useEffect(() => {
    const ammPools = LiquidityPoolDictionary.list().filter(
      item => item.hasSovRewards,
    );
    if (address !== '' && address !== ethGenesisAddress) {
      const pools = ammPools.flatMap(item =>
        item.version === 1
          ? [item.supplyAssets[0]]
          : [item.supplyAssets[0], item.supplyAssets[1]],
      );
      bridgeNetwork
        .multiCall<{ [key: string]: string }>(
          Chain.RSK,
          pools.flatMap((item, index) => {
            return [
              {
                address: getContract('liquidityMiningProxy').address,
                abi: getContract('liquidityMiningProxy').abi,
                fnName: 'getUserAccumulatedReward',
                args: [item.getContractAddress(), address],
                key: `getUserAccumulatedReward_${index}_${item.asset}`,
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
          setLiquidityRewards(total.toString());
        })
        .catch(error => {
          console.error('e', error);
        });
    }
  }, [address]);

  return liquidityRewards;
};
