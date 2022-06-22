import { useQuery, gql } from '@apollo/client';
import { useAccount } from 'app/hooks/useAccount';
import { useMemo } from 'react';

export const useGetStakeHistory = (page: number, pageSize: number) => {
  const account = useAccount();
  const skip = useMemo(() => {
    if (page === 1) {
      return 0;
    }
    return (page - 1) * pageSize;
  }, [page, pageSize]);
  const STAKING_HISTORY = gql`
    query getStakeHistory($user: ID!, $skip: Int!) {
      stakeHistoryItems(
        first: ${pageSize},
        skip: $skip,
        where: { user: $user }
        orderBy: timestamp
        orderDirection: desc
      ) {
        id
        action
        transaction {
          id
        }
        amount
        lockedUntil
        timestamp
      }
    }
  `;

  return useQuery(STAKING_HISTORY, {
    variables: { user: account.toLowerCase(), skip: skip },
  });
};
