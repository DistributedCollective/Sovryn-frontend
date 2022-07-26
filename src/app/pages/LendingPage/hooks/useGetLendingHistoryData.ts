import { useAccount } from 'app/hooks/useAccount';
import { useGetLendHistoryQuery } from 'utils/graphql/rsk/generated';
import { APOLLO_POLL_INTERVAL } from 'utils/classifiers';

export function useGetLendingHistoryData() {
  const account = useAccount();
  return useGetLendHistoryQuery({
    variables: {
      user: account.toLowerCase(),
    },
    pollInterval: APOLLO_POLL_INTERVAL,
  });
}
