import { contractReader } from 'utils/sovryn/contract-reader';

import VestingABI from '../abi/Vesting.json';
import FourYearVestingABI from '../abi/FourYearVesting.json';
import { VestGroup } from 'app/components/UserAssets/Vesting/types';

export function vesting_getStartDate(
  vestingAddress: string,
  vestingType: VestGroup,
) {
  return contractReader.callByAddress(
    vestingAddress,
    vestingType === 'fouryear' ? FourYearVestingABI : VestingABI,
    'startDate',
    [],
  );
}

export function vesting_getEndDate(
  vestingAddress: string,
  vestingType: VestGroup,
) {
  return contractReader.callByAddress(
    vestingAddress,
    vestingType === 'fouryear' ? FourYearVestingABI : VestingABI,
    'endDate',
    [],
  );
}
