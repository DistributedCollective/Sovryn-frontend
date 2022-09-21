import { useAccount } from 'app/hooks/useAccount';
import { APOLLO_POLL_INTERVAL } from 'utils/classifiers';
import { useGetLimitOrderFilledQuery } from 'utils/graphql/rsk/generated';

export const useGetLimitOrderFilled = () => {
  const account = useAccount();
  return useGetLimitOrderFilledQuery({
    variables: { maker: account.toLowerCase() },
    pollInterval: APOLLO_POLL_INTERVAL,
  });
};
