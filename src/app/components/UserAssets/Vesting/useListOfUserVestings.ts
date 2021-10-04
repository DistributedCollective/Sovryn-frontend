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

              // 'type' can be 0 or 1, 0 - Team Vesting, 1 - Vesting
              // 'typeCreation' can be 1, 2, 3 representing Vesting Registry 1, Vesting Registry 2 and Vesting Registry 3

              const labelTeam =
                typeCreation[index] === '1' && type[index] === '0'
                  ? 'team'
                  : '';
              const labelGenesys =
                typeCreation[index] === '1' && type[index] === '1'
                  ? 'genesis'
                  : '';
              const labelOrigin =
                typeCreation[index] === '2' && type[index] === '1'
                  ? 'origin'
                  : '';
              const labelReward =
                typeCreation[index] === '3' && type[index] === '1'
                  ? 'reward'
                  : '';

              return {
                asset: Asset.SOV,
                staking: 'staking',
                type: labelGenesys || labelTeam || labelReward || labelOrigin,
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
