import { Asset } from 'types/asset';
import { useAccount } from 'app/hooks/useAccount';
import { useEffect, useState } from 'react';
import { ethGenesisAddress } from 'utils/classifiers';
import { Vesting, FullVesting, DetailsProps } from './types';
import { useVesting_getVestingsOf } from 'app/hooks/staking/useVesting_getVestingsOf';
import { contractReader } from 'utils/sovryn/contract-reader';

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
                  ? 'genesis'
                  : '';
              const labelTeam =
                typeCreation[index] === '1' && type[index] === '0'
                  ? 'team'
                  : '';
              const labelReward =
                typeCreation[index] === '3' && type[index] === '1'
                  ? 'reward'
                  : '';
              const registryMethod =
                type[index] === '0' ? 'getTeamVesting' : 'getVestingAddr';

              return {
                asset: Asset.SOV,
                registry: 'vestingRegistry',
                registryMethod: registryMethod,
                staking: 'staking',
                type: labelGenesys || labelTeam || labelReward,
                typeCreation: typeCreation[index],
                cliff: vestingDetails.cliff,
                duration: vestingDetails.duration,
                vestingContract: address[index],
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
        return possibleVestings as FullVesting[];
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
