import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '../../utils/graphQlHelpers';
import { CompetitionPageContainer } from './CompetitionPageContainer';

export const CompetitionPage: React.FC = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <CompetitionPageContainer />
    </ApolloProvider>
  );
};
