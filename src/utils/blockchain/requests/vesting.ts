import { contractReader } from 'utils/sovryn/contract-reader';

import VestingABI from '../abi/Vesting.json';
import FourYearVestingABI from '../abi/FourYearVesting.json';
import { VestGroup } from 'app/components/UserAssets/Vesting/types';

export const vesting_getStartDate = (
  vestingAddress: string,
  vestingType: VestGroup,
) => {
  return contractReader.callByAddress(
    vestingAddress,
    getVestingAbi(vestingType),
    'startDate',
    [],
  );
};

export const vesting_getEndDate = (
  vestingAddress: string,
  vestingType: VestGroup,
) => {
  return contractReader.callByAddress(
    vestingAddress,
    getVestingAbi(vestingType),
    'endDate',
    [],
  );
};

export const getVestingAbi = (vestingType: VestGroup) => {
  return vestingType === 'fouryear' ? FourYearVestingABI : VestingABI;
};
