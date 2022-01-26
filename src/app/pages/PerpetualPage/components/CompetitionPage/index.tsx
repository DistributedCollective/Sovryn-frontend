import React from 'react';
import { CompetitionPageContainer } from './CompetitionPageContainer';
import { GraphQLProvider } from '../../contexts/GraphQLProvider';

export const CompetitionPage: React.FC = () => {
  return (
    <GraphQLProvider>
      <CompetitionPageContainer />
    </GraphQLProvider>
  );
};
