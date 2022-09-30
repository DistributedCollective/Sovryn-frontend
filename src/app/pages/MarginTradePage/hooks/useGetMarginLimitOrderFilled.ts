import { useAccount } from 'app/hooks/useAccount';
import { APOLLO_POLL_INTERVAL } from 'utils/classifiers';
import { useGetMarginLimitOrderFilledQuery } from 'utils/graphql/rsk/generated';

/** Hook to return Margin Order Filled data for Margin page */

export const useGetMarginLimitOrderFilled = () => {
  const account = useAccount();
  return useGetMarginLimitOrderFilledQuery({
    variables: { trader: account.toLowerCase() },
    pollInterval: APOLLO_POLL_INTERVAL,
  });
};
