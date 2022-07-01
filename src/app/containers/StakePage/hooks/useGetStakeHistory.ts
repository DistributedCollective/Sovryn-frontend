import { useAccount } from 'app/hooks/useAccount';
import { useMemo } from 'react';
import { APOLLO_POLL_INTERVAL } from 'utils/classifiers';
import { useGetStakeHistoryQuery } from 'utils/graphql/rsk/generated';

export const useGetStakeHistory = (page: number, pageSize: number) => {
  const account = useAccount();

  const skip = useMemo(() => {
    if (page === 1) {
      return 0;
    }
    return (page - 1) * pageSize;
  }, [page, pageSize]);

  return useGetStakeHistoryQuery({
    variables: {
      user: account.toLowerCase(),
      skip: skip,
      pageSize: pageSize,
    },
    pollInterval: APOLLO_POLL_INTERVAL,
  });
};
