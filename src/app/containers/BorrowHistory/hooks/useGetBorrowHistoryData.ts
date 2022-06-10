import { useQuery, gql } from '@apollo/client';
import { useAccount } from 'app/hooks/useAccount';

/** Hook to return data for Borrow History page */

export function useGetBorrowHistoryData() {
  const account = useAccount();
  const BORROW_HISTORY = gql`
    query {
      user(id: "${account.toLowerCase()}") {
        borrows {
          loanId {
            id
          }
          loanToken
          collateralToken
          newPrincipal
          newCollateral
          interestRate
          interestDuration
          collateralToLoanRate
          timestamp
          transaction {
            id
          }
        }
      }
    }`;
  const { data, loading } = useQuery(BORROW_HISTORY);

  return { data, loading };
}
