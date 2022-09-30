import { useAccount } from 'app/hooks/useAccount';
import { APOLLO_POLL_INTERVAL } from 'utils/classifiers';
import { useGetRewardClaimedQuery } from 'utils/graphql/rsk/generated';

export const useGetTotalLendingRewards = () => {
  const account = useAccount();

  return useGetRewardClaimedQuery({
    variables: {
      user: account.toLowerCase(),
    },
    pollInterval: APOLLO_POLL_INTERVAL,
  });
};
