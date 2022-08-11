import { useAccount } from 'app/hooks/useAccount';
import { APOLLO_POLL_INTERVAL } from 'utils/classifiers';
import { useGetTradingRewardsQuery } from 'utils/graphql/rsk/generated';

export const useGetTradingRewards = () => {
  const account = useAccount();

  return useGetTradingRewardsQuery({
    variables: {
      id: account.toLowerCase(),
    },
    pollInterval: APOLLO_POLL_INTERVAL,
  });
};
