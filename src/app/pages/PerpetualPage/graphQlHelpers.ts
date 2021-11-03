import { ApolloClient, InMemoryCache } from '@apollo/client';

export const apolloClient = new ApolloClient({
  uri:
    'http://3.22.188.172:80/subgraphs/name/DistributedCollective/Sovryn-perpetual-swaps-subgraph',
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});
