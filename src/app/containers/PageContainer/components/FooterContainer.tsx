import React from 'react';
import { Footer } from '../components/DefaultFooterComponent/DefaultFooterComponent';
import { PageContextType } from '../types';

export const FooterContainer: React.FC<PageContextType> = React.memo(
  ({ state, actions }) => {
    const { options } = state;
    if (options.footer) {
      return <>{options.footer({ state, actions })}</>;
    }
    return <Footer state={state} actions={actions} />;
  },
);
