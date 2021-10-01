import { Asset } from 'types/asset';
import { ContractName } from 'utils/types/contracts';

export type Vesting = {
  asset: Asset;
  label: string;
  registry: ContractName;
  registryMethod: RegistryMethodTypes;
  staking: ContractName;
  type: VestGroup;
  typeCreation: string;
  cliff: string;
  duration: string;
  vestingContract: string;
};

export type FullVesting = Vesting & {
  vestingContract: string;
  balance: string;
  stakes: StakesProp;
};

export type DetailsProps = {
  cliff: string;
  duration: string;
};

type RegistryMethodTypes = 'getVestingAddr' | 'getTeamVesting';

export type VestGroup = 'genesis' | 'origin' | 'team' | 'reward' | 'fish' | 'fishAirdrop';

type StakesProp = {
  dates: Date[];
  stakes: string[];
};
