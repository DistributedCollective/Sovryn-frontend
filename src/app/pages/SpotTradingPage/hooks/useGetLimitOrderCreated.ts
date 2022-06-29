import { useAccount } from 'app/hooks/useAccount';
import { useMemo } from 'react';
import { APOLLO_POLL_INTERVAL, isMainnet } from 'utils/classifiers';
import {
  Network,
  useGetLimitOrderCreatedQuery,
} from 'utils/graphql/rsk/generated';

/** Hook to return Order Created data for Spot page */

export const useGetLimitOrderCreated = () => {
  const account = useAccount();
  const network = useMemo(() => {
    return isMainnet ? Network.Mainnet : Network.Testnet;
  }, []);

  return useGetLimitOrderCreatedQuery({
    variables: { network: network, maker: account.toLowerCase() },
    pollInterval: APOLLO_POLL_INTERVAL,
  });
};
