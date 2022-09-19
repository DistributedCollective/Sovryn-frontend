import { useAccount } from 'app/hooks/useAccount';
import { APOLLO_POLL_INTERVAL } from 'utils/classifiers';
import {
  Network,
  useGetLimitOrderCreatedQuery,
} from 'utils/graphql/rsk/generated';

/** Hook to return Order Created data for Spot page */

export const useGetLimitOrderCreated = () => {
  const account = useAccount();

  // need to use testnet subgraph for both testnet and mainnet, because mainnet orderbook is on testnet.
  return useGetLimitOrderCreatedQuery({
    variables: { network: Network.Testnet, maker: account.toLowerCase() },
    pollInterval: APOLLO_POLL_INTERVAL,
  });
};
