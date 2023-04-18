import { ApolloClient, InMemoryCache } from '@apollo/client';
import { graphBabelfishUrl, graphRskUrl } from './classifiers';

export const rskClient = new ApolloClient({
  uri: graphRskUrl,
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});

export const babelfishClient = new ApolloClient({
  uri: graphBabelfishUrl,
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});
