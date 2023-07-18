import { Asset } from 'types/asset';
import { ContractName } from 'utils/types/contracts';

export type Vesting = {
  asset: Asset;
  staking: ContractName;
  type: VestGroup;
  typeCreation: string;
  vestingContract: string;
};

export type FullVesting = Vesting & {
  balance: string;
  stakes: StakesProp;
};

export type VestGroup =
  | 'genesis'
  | 'origin'
  | 'team'
  | 'reward'
  | 'fouryear'
  | 'teamFouryear'
  | 'fish'
  | 'fishAirdrop';

export type StakesProp = {
  dates: Date[];
  stakes: string[];
};
