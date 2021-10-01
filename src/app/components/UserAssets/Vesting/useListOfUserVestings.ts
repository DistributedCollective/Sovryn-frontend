import { ContractName } from 'utils/types/contracts';
import { Asset } from 'types/asset';
import { useAccount } from '../../../hooks/useAccount';
import { useEffect, useState } from 'react';
import { ethGenesisAddress } from '../../../../utils/classifiers';
import { bridgeNetwork } from '../../../pages/BridgeDepositPage/utils/bridge-network';
import { getContract } from '../../../../utils/blockchain/contract-helpers';
import { Chain } from '../../../../types';

import vestingRegistryAbi from 'utils/blockchain/abi/VestingRegistry.json';
import { useVesting_getVestingsOf } from 'app/hooks/staking/useVesting_getVestingsOf';
import { contractReader } from 'utils/sovryn/contract-reader';

type RegistryMethodTypes = 'getVestingAddr' | 'getTeamVesting';

export type Vesting = {
  asset: Asset;
  label: string;
  registry: ContractName;
  registryMethod: RegistryMethodTypes;
  staking: ContractName;
  type: string;
  typeCreation: string;
  cliff: string;
  duration: string;
};

type StakesProp = {
  dates: Date[];
  stakes: string[];
};

type DetailsProps = {
  cliff: string;
  duration: string;
};

export type FullVesting = Vesting & {
  vestingContract: string;
  balance: string;
  stakes: StakesProp;
};

export function useListOfUserVestings(asset?: Asset) {
  const account = useAccount();
  const [items, setItems] = useState<FullVesting[]>([]);
  const [loading, setLoading] = useState(false);
  const {
    loading: loadingVestings,
    value: vestingsContracts,
  } = useVesting_getVestingsOf(account);
  const [possibleVestings, setPossibleVestings] = useState<Vesting[]>([]);

  useEffect(() => {
    async function getVestings() {
      try {
        const address: string[] = [],
          type: string[] = [],
          typeCreation: string[] = [];
        if (!loadingVestings) {
          for (let i in vestingsContracts) {
            address.push(vestingsContracts[i].vestingAddress);
            type.push(vestingsContracts[i].vestingType);
            typeCreation.push(vestingsContracts[i].vestingCreationType);
          }
          Promise.all(
            address.map(async (item, index) => {
              const vestingDetails: DetailsProps = await contractReader.call(
                'vestingRegistry',
                'getVestingDetails',
                [item],
              );

              const labelGenesys =
                typeCreation[index] === '1' && type[index] === '1'
                  ? 'Genesys SOV'
                  : '';
              const labelTeam =
                typeCreation[index] === '1' && type[index] === '0'
                  ? 'Team SOV'
                  : '';
              const labelReward =
                typeCreation[index] === '3' && type[index] === '1'
                  ? 'Reward SOV'
                  : '';
              const registryMethod =
                type[index] === '0' ? 'getTeamVesting' : 'getVestingAddr';

              return {
                asset: Asset.SOV,
                label: labelGenesys || labelTeam || labelReward,
                registry: 'vestingRegistry',
                registryMethod: registryMethod,
                staking: 'staking',
                typeCreation: typeCreation[index],
                cliff: vestingDetails.cliff,
                duration: vestingDetails.duration,
              } as Vesting;
            }),
          ).then(result => {
            setPossibleVestings(result);
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    getVestings();
  }, [vestingsContracts, loadingVestings, account, asset]);

  useEffect(() => {
    if (!account || account === ethGenesisAddress || !possibleVestings.length) {
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
              args: [account, item.cliff, item.duration, item.typeCreation],
              key: index.toString(),
              parser: val => val[0].toString(),
            };
          }),
        );

        console.log(filteredVestings);

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
  }, [account, asset, possibleVestings]);

  return { items, loading };
}
