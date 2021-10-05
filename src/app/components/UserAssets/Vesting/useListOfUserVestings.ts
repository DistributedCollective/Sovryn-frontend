import { Asset } from 'types/asset';
import { useAccount } from 'app/hooks/useAccount';
import { useEffect, useState } from 'react';
import { ethGenesisAddress } from 'utils/classifiers';
import { Vesting, FullVesting } from './types';
import { useVesting_getVestingsOf } from 'app/hooks/staking/useVesting_getVestingsOf';
import { useVesting_getVestingFish } from 'app/hooks/staking/useVesting_getVestingFish';
import { useVesting_getVestingFishAirdrop } from 'app/hooks/staking/useVesting_getVestingFishAirdrop';

export function useListOfUserVestings(asset?: Asset) {
  const account = useAccount();
  const [items, setItems] = useState<FullVesting[]>([]);
  const [loading, setLoading] = useState(false);
  const {
    loading: loadingVestings,
    value: vestingsContracts,
  } = useVesting_getVestingsOf(account);
  const [possibleVestings, setPossibleVestings] = useState<Vesting[]>([]);

  const { value: fishOrigins } = useVesting_getVestingFish(account);
  const { value: fishAirdrop } = useVesting_getVestingFishAirdrop(account);

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
          //for FISH ORIGIN
          if (fishOrigins.length) {
            if (fishOrigins !== ethGenesisAddress) {
              address.push(fishOrigins);
              type.push('fish');
              typeCreation.push('vestingRegistryFISH');
            }
          }
          //for FISH AIRDROP
          if (fishAirdrop.length) {
            if (fishAirdrop !== ethGenesisAddress) {
              address.push(fishAirdrop);
              type.push('fish');
              typeCreation.push('vestingRegistryFISH');
            }
          }
          Promise.all(
            address.map(async (item, index) => {
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
              const labelFishOrigin =
                typeCreation[index] === 'vestingRegistryFISH' &&
                type[index] === 'fish'
                  ? 'fish'
                  : '';
              const labelFishAirdrop =
                typeCreation[index] === 'vestingRegistryFISH' &&
                type[index] === 'fishAirdrop'
                  ? 'fishAirdrop'
                  : '';

              const assetType =
                typeCreation[index] === 'vestingRegistryFISH'
                  ? Asset.FISH
                  : Asset.SOV;

              const regystryType =
                typeCreation[index] === 'vestingRegistryFISH'
                  ? 'FISH_staking'
                  : 'staking';

              return {
                asset: assetType,
                staking: regystryType,
                type:
                  labelGenesys ||
                  labelTeam ||
                  labelReward ||
                  labelOrigin ||
                  labelFishOrigin ||
                  labelFishAirdrop,
                typeCreation: typeCreation[index],
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
  }, [
    vestingsContracts,
    loadingVestings,
    account,
    asset,
    fishAirdrop,
    fishOrigins,
  ]);

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
