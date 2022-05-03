import { contractReader } from 'utils/sovryn/contract-reader';

import VestingABI from '../abi/Vesting.json';

export function vesting_getStartDate(vestingAddress: string) {
  return contractReader.callByAddress(
    vestingAddress,
    VestingABI,
    'startDate',
    [],
  );
}

export function vesting_getEndDate(vestingAddress: string) {
  return contractReader.callByAddress(
    vestingAddress,
    VestingABI,
    'endDate',
    [],
  );
}
