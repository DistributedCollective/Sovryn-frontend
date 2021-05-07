import { booleafy } from 'utils/helpers';
import type { ActiveLoan } from 'types/active-loan';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

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
    'getUserLoans',
    [],
    account,
    from,
    count,
    loanType,
    booleafy(isLender),
    booleafy(unsafeOnly),
  );
}
