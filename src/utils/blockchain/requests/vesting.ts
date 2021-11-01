import { contractReader } from 'utils/sovryn/contract-reader';
import { contractWriter } from 'utils/sovryn/contract-writer';

import VestingABI from '../abi/Vesting.json';
import { gasLimit } from 'utils/classifiers';
import { TxType } from 'store/global/transactions-store/types';

export function vesting_delegate(
  vestingAddress: string,
  owner: string,
  delegatee: string,
) {
  return contractWriter.sendByAddress(vestingAddress, VestingABI, 'delegate', [
    delegatee,
    { from: owner },
  ]);
}

export function vesting_withdraw(vestingAddress: string, receiver: string) {
  return contractWriter.sendByAddress(
    vestingAddress,
    VestingABI,
    'withdrawTokens',
    [receiver],
    {
      gas: gasLimit[TxType.SOV_WITHDRAW_VESTING],
    },
  );
}

export function vesting_getCliff(vestingAddress: string) {
  return contractReader.callByAddress(vestingAddress, VestingABI, 'cliff', []);
}

export function vesting_getDuration(vestingAddress: string) {
  return contractReader.callByAddress(
    vestingAddress,
    VestingABI,
    'duration',
    [],
  );
}

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

export function vesting_getFOUR_WEEKS(vestingAddress: string) {
  return contractReader.callByAddress(
    vestingAddress,
    VestingABI,
    'FOUR_WEEKS',
    [],
  );
}
