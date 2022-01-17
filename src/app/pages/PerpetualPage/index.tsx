import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { PerpetualPageContainer } from './PerpetualPageContainer';
import { apolloClient } from './utils/graphQlHelpers';

export const PerpetualPage = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <PerpetualPageContainer />
    </ApolloProvider>
  );
};
