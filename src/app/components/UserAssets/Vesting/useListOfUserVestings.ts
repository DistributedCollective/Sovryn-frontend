import { ContractName } from 'utils/types/contracts';
import { Asset } from 'types/asset';
import { useAccount } from '../../../hooks/useAccount';
import { useEffect, useState } from 'react';
import { ethGenesisAddress } from '../../../../utils/classifiers';
import { bridgeNetwork } from '../../../pages/BridgeDepositPage/utils/bridge-network';
import { getContract } from '../../../../utils/blockchain/contract-helpers';
import { Chain } from '../../../../types';

import vestingRegistryAbi from 'utils/blockchain/abi/VestingRegistry.json';
import stakingAbi from 'utils/blockchain/abi/Staking.json';
// import vestingAbi from 'utils/blockchain/abi/Vesting.json';

type RegistryMethodTypes = 'getVesting' | 'getTeamVesting';

type Vesting = {
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

        const vestings = filteredVestings
          .map((item, index) => {
            item.vestingContract = contracts[index];
            return item;
          })
          .filter(item => item.vestingContract !== ethGenesisAddress);

        // get vesting info
        const mc = vestings
          .map((item, index) => {
            return [
              {
                address: getContract(item.staking).address,
                abi: stakingAbi,
                fnName: 'balanceOf',
                args: [item.vestingContract],
                key: `${index}/balance`,
                parser: val => val[0].toString(),
              },
              {
                address: getContract(item.staking).address,
                abi: stakingAbi,
                fnName: 'getStakes',
                args: [item.vestingContract],
                key: `${index}/stakes`,
                parser: val => ({
                  dates: val[0].map(item => new Date(item.toNumber() * 1000)),
                  stakes: val[1].map(item => item.toString()),
                }),
              },
              // will be useful in the future, leaving commented to retrieve data faster for now.
              // {
              //   address: item.vestingContract!,
              //   abi: vestingAbi,
              //   fnName: 'cliff',
              //   args: [],
              //   key: `${index}/cliff`,
              //   parser: val => val[0].toString(),
              // },
              // {
              //   address: item.vestingContract!,
              //   abi: vestingAbi,
              //   fnName: 'duration',
              //   args: [],
              //   key: `${index}/duration`,
              //   parser: val => val[0].toString(),
              // },
              // {
              //   address: item.vestingContract!,
              //   abi: vestingAbi,
              //   fnName: 'startDate',
              //   args: [],
              //   key: `${index}/startDate`,
              //   parser: val => new Date(val[0].toNumber() * 1000),
              // },
              // {
              //   address: item.vestingContract!,
              //   abi: vestingAbi,
              //   fnName: 'endDate',
              //   args: [],
              //   key: `${index}/endDate`,
              //   parser: val => new Date(val[0].toNumber() * 1000),
              // },
            ];
          })
          .flat(1);

        const { returnData: info } = await bridgeNetwork.multiCall(
          Chain.RSK,
          mc,
        );

        return vestings
          .map((item, index) => {
            item.balance = info[`${index}/balance`];
            item.stakes = info[`${index}/stakes`];
            return item;
          })
          .filter(item => item.balance !== '0');
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
