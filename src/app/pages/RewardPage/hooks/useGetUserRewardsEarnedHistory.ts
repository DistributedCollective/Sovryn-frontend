import { useAccount } from 'app/hooks/useAccount';
import { useMemo } from 'react';
import { APOLLO_POLL_INTERVAL } from 'utils/classifiers';
import {
  RewardsEarnedAction,
  useGetUserRewardsEarnedHistoryQuery,
} from 'utils/graphql/rsk/generated';

export const useGetUserRewardsEarnedHistory = (
  page: number,
  actions: RewardsEarnedAction[],
  pageSize: number,
) => {
  const account = useAccount();

  const skip = useMemo(() => {
    if (page === 1) {
      return 0;
    }
    return (page - 1) * pageSize;
  }, [page, pageSize]);

  return useGetUserRewardsEarnedHistoryQuery({
    variables: {
      user: account.toLowerCase(),
      skip: skip,
      pageSize: pageSize,
      actions,
    },
    pollInterval: APOLLO_POLL_INTERVAL,
  });
};
