import { ContractName } from 'utils/types/contracts';
import { Asset } from 'types/asset';
import { useAccount } from '../../../hooks/useAccount';
import { useEffect, useState } from 'react';
import { ethGenesisAddress } from '../../../../utils/classifiers';
import { bridgeNetwork } from '../../../pages/BridgeDepositPage/utils/bridge-network';
import { getContract } from '../../../../utils/blockchain/contract-helpers';
import { Chain } from '../../../../types';

import vestingRegistryAbi from 'utils/blockchain/abi/VestingRegistry.json';

type RegistryMethodTypes = 'getVesting' | 'getTeamVesting';

export type Vesting = {
  asset: Asset;
  label: string;
  registry: ContractName;
  registryMethod: RegistryMethodTypes;
  staking: ContractName;
};

type StakesProp = {
  dates: Date[];
  stakes: string[];
};

export type FullVesting = Vesting & {
  vestingContract: string;
  balance: string;
  stakes: StakesProp;
};

const possibleVestings: Vesting[] = [
  {
    asset: Asset.SOV,
    label: 'Genesis SOV',
    registry: 'vestingRegistry',
    registryMethod: 'getVesting',
    staking: 'staking',
  },
  {
    asset: Asset.SOV,
    label: 'Reward SOV',
    registry: 'vestingRegistryLM',
    registryMethod: 'getVesting',
    staking: 'staking',
  },
  {
    asset: Asset.SOV,
    label: 'Team SOV',
    registry: 'vestingRegistry',
    registryMethod: 'getTeamVesting',
    staking: 'staking',
  },
  {
    asset: Asset.SOV,
    label: 'Origin SOV',
    registry: 'vestingRegistryOrigin',
    registryMethod: 'getVesting',
    staking: 'staking',
  },
  {
    asset: Asset.FISH,
    label: 'Origin FISH',
    registry: 'vestingRegistryFISH',
    registryMethod: 'getVesting',
    staking: 'FISH_staking',
  },
];

export function useListOfUserVestings(asset?: Asset) {
  const account = useAccount();

  const [items, setItems] = useState<FullVesting[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!account || account === ethGenesisAddress) {
      setItems([]);
      setLoading(false);
    } else {
      setLoading(true);

      const run = async () => {
        // restrict list to requested asset only if needed
        const filteredVestings: FullVesting[] = possibleVestings.filter(item =>
          asset ? item.asset === asset : true,
        ) as FullVesting[];
        // get vesting contracts
        const { returnData: contracts } = await bridgeNetwork.multiCall(
          Chain.RSK,
          filteredVestings.map((item, index) => {
            return {
              address: getContract(item.registry).address,
              abi: vestingRegistryAbi,
              fnName: item.registryMethod,
              args: [account],
              key: index.toString(),
              parser: val => val[0].toString(),
            };
          }),
        );

        return filteredVestings
          .map((item, index) => {
            item.vestingContract = contracts[index];
            return item;
          })
          .filter(item => item.vestingContract !== ethGenesisAddress);
      };

      run()
        .then(result => {
          setItems(result);
          setLoading(false);
        })
        .catch(error => {
          console.error(error);
          setItems([]);
          setLoading(false);
        });
    }
  }, [account, asset]);

  return { items, loading };
}
