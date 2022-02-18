import { booleafy } from 'utils/helpers';
import type { ActiveLoan } from 'types/active-loan';
import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { currentNetwork } from 'utils/classifiers';
import { AppMode } from 'types';

export function useGetActiveLoans(
  account: string,
  from: number = 0,
  count: number = 100,
  loanType: number = 0,
  isLender: boolean = false,
  unsafeOnly: boolean = false,
) {
  return useCacheCallWithValue<Array<ActiveLoan>>(
    'sovrynProtocol',
    // method available on testnet only until this PR is deployed to mainnet
    // https://github.com/DistributedCollective/Sovryn-smart-contracts/pull/412
    currentNetwork === AppMode.MAINNET ? 'getUserLoans' : 'getUserLoansV2',
    [],
    account,
    from,
    count,
    loanType,
    booleafy(isLender),
    booleafy(unsafeOnly),
  );
}
