import React from 'react';
import { DefaultHeaderComponent } from '../components/DefaultHeaderComponent/DefaultHeaderComponent';
import { PageContextType } from '../types';

export const HeaderContainer: React.FC<PageContextType> = React.memo(
  ({ state, actions }) => {
    const { options } = state;
    if (options.header) {
      return <>{options.header({ state, actions })}</>;
    }
    return <DefaultHeaderComponent state={state} actions={actions} />;
  },
);
