import { useAccount } from 'app/hooks/useAccount';
import { APOLLO_POLL_INTERVAL } from 'utils/classifiers';
import { useGetVestedHistoryQuery } from 'utils/graphql/rsk/generated';

export const useGetVestedHistory = () => {
  const account = useAccount();

  return useGetVestedHistoryQuery({
    variables: {
      user: account.toLowerCase(),
    },
    pollInterval: APOLLO_POLL_INTERVAL,
  });
};
