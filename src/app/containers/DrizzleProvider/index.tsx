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
  drizzleError: React.ReactNode;
  drizzleLoadingContractsAndAccounts: React.ReactNode;
  drizzleLoadingWeb3: React.ReactNode;
}

export function DrizzleProvider(props: Props) {
  return (
    <drizzleReactHooks.DrizzleProvider drizzle={props.drizzle}>
      <drizzleReactHooks.Initializer
        error={props.drizzleError}
        loadingContractsAndAccounts={props.drizzleLoadingContractsAndAccounts}
        loadingWeb3={props.drizzleLoadingWeb3}
      >
        {props.children}
      </drizzleReactHooks.Initializer>
    </drizzleReactHooks.DrizzleProvider>
  );
}

DrizzleProvider.defaultProps = {
  drizzleError: <>There was an error connecting to blockchain node.</>,
  drizzleLoadingContractsAndAccounts: <>Loading contracts and accounts.</>,
  drizzleLoadingWeb3: <>Loading web3.</>,
};
