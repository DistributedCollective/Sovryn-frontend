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

  const { value: fishOrigins, loading: loading1 } = useVesting_getVestingFish(
    account,
  );
  const {
    value: fishAirdrop,
    loading: loading2,
  } = useVesting_getVestingFishAirdrop(account);

  useEffect(() => {
    async function getVestings() {
      try {
        setLoading(true);
        const address: string[] = [];
        const type: string[] = [];
        const typeCreation: string[] = [];

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
            address.map(
              async (item, index): Promise<Vesting> => {
                // 'type' can be 0 or 1, 0 - Team Vesting, 1 - Vesting, fish, fishAirdrop
                // 'typeCreation' can be 1-4 representing Vesting Registry 1-4
                const label = {
                  '0 1': 'team',
                  '1 1': 'genesis',
                  '1 2': 'origin',
                  '1 3': 'reward',
                  '1 4': 'fouryear',
                  'fish vestingRegistryFISH': 'fish',
                  'fishAirdrop vestingRegistryFISH': 'fishAirdrop',
                }[`${type[index]} ${typeCreation[index]}`];

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
                  type: label,
                  typeCreation: typeCreation[index],
                  vestingContract: address[index],
                };
              },
            ),
          ).then((result: any) => {
            setItems(result);
            setLoading(false);
          });
        }
      } catch (e) {
        console.error(e);
        setLoading(false);
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

  return { items, loading: loading || loading1 || loading2 };
}
