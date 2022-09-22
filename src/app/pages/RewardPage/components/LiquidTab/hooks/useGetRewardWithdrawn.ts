import { useAccount } from 'app/hooks/useAccount';
import { APOLLO_POLL_INTERVAL } from 'utils/classifiers';
import { useGetRewardWithdrawnQuery } from 'utils/graphql/rsk/generated';

export const useGetRewardEarnedEvents = () => {
  const account = useAccount();

  return useGetRewardWithdrawnQuery({
    variables: {
      user: account.toLowerCase(),
    },
    pollInterval: APOLLO_POLL_INTERVAL,
  });
};
