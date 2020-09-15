import { booleafy } from '../../../utils/helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

export interface ActiveLoan {
  collateral: string;
  collateralToken: string;
  currentMargin: string;
  endTimestamp: string;
  interestDepositRemaining: string;
  interestOwedPerDay: string;
  loanId: string;
  loanToken: string;
  maintenanceMargin: string;
  maxLiquidatable: string;
  maxLoanTerm: string;
  maxSeizable: string;
  principal: string;
  startMargin: string;
  startRate: string;
}

export function useGetActiveLoans(
  account: string,
  from: number = 0,
  to: number = 100,
  loanType: number = 0,
  isLender: boolean = false,
  unsafeOnly: boolean = false,
) {
  const { value, loading, error } = useCacheCallWithValue(
    'sovrynProtocol',
    'getUserLoans',
    [],
    account,
    from,
    to,
    loanType,
    booleafy(isLender),
    booleafy(unsafeOnly),
  );
  return { value, loading, error };
}
