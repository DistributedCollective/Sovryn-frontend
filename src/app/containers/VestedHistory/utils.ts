import { Asset } from 'types';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { VestingContractType } from 'utils/graphql/rsk/generated';

export const getAsset = (type: VestingContractType) => {
  switch (type) {
    case VestingContractType.Fish:
    case VestingContractType.FishTeam:
      return AssetsDictionary.get(Asset.FISH);
    default:
      return AssetsDictionary.get(Asset.SOV);
  }
};
