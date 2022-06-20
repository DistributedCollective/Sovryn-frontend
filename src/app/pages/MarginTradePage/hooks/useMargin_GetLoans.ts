import { useQuery, gql } from '@apollo/client';
import { useAccount } from 'app/hooks/useAccount';
import { useMemo } from 'react';

/** Hook to return loans data for Margin open or closed positions */

export const useGetMarginLoans = (
  page: number,
  isOpen: boolean,
  pageSize: number,
) => {
  const account = useAccount();
  const currentPage = useMemo(() => {
    if (page === 1) {
      return 0;
    }
    return (page - 1) * pageSize;
  }, [page, pageSize]);

  const MARGIN_LOANS = gql`
    query getMarginLoans($user: ID!, $skip: Int!, $isOpen: Boolean!) {
      loans(
        first: ${pageSize},
        skip: $skip,
        where: {user: $user, isOpen: $isOpen, type: Trade},
        orderBy: startTimestamp,
        orderDirection: desc
      ) {
        id
        type
        trade {
          id
          timestamp
          loanToken {
            id
          }
          entryPrice
          transaction {
            id
          }
          positionSize
          interestRate
          entryLeverage
          collateralToken {
            id
          }
          borrowedAmount
          currentLeverage
        }
        isOpen
        loanToken {
          id
        }
        realizedPnL
        nextRollover
        positionSize
        collateralToken {
          id
        }
        startTimestamp
        realizedPnLPercent
        depositCollateral {
          id
          rate
          loanId {
            id
          }
          timestamp
          transaction {
            id
          }
          depositAmount
        }
        liquidates {
          id
          timestamp
          loanToken
          transaction {
            id
          }
          currentMargin
          collateralToken
          collateralToLoanRate
          collateralWithdrawAmount
        }
        closeWithSwaps {
          id
          timestamp
          loanToken
          exitPrice
          transaction {
            id
          }
          loanCloseAmount
          currentLeverage
          collateralToken
          positionCloseSize
        }
        closewithDeposits {
          id
          loanToken
          timestamp
          transaction {
            id
          }
          collateralToken
          collateralToLoanRate
          collateralWithdrawAmount
        }
      }
    }
  `;

  return useQuery(MARGIN_LOANS, {
    variables: {
      skip: currentPage,
      user: account.toLowerCase(),
      isOpen: isOpen,
    },
  });
};
