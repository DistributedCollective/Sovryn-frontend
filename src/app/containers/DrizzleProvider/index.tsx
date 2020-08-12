/**
 *
 * DrizzleProvider
 *
 */

import React from 'react';
import { Drizzle } from '@drizzle/store';
import { drizzleReactHooks } from '@drizzle/react-plugin';

interface Props {
  drizzle: Drizzle | any;
  children: React.ReactNode;
}

export function DrizzleProvider({ drizzle, children }: Props) {
  return (
    <drizzleReactHooks.DrizzleProvider drizzle={drizzle}>
      <drizzleReactHooks.Initializer
        error="There was an error connecting to blockchain node."
        loadingContractsAndAccounts="Loading contracts and accounts."
        loadingWeb3="Loading web3."
      >
        {children}
      </drizzleReactHooks.Initializer>
    </drizzleReactHooks.DrizzleProvider>
  );
}
