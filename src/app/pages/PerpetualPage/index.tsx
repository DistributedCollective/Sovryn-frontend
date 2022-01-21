import React from 'react';
import { PerpetualPageContainer } from './PerpetualPageContainer';
import { GraphQLProvider } from './contexts/GraphQLProvider';

export const PerpetualPage: React.FC = () => {
  return (
    <GraphQLProvider>
      <PerpetualPageContainer />
    </GraphQLProvider>
  );
};
