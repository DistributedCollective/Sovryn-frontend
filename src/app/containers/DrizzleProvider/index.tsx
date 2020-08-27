/**
 *
 * DrizzleProvider
 *
 */

import React, { useEffect } from 'react';
import { Drizzle } from '@drizzle/store';
import { drizzleReactHooks } from '@drizzle/react-plugin';
import { useLocation } from 'react-router-dom';
import { useDrizzle } from '../../hooks/useDrizzle';
import { isObjectEmpty } from '../../../utils/helpers';

interface Props {
  drizzle: Drizzle | any;
  children: React.ReactNode;
}

export function DrizzleProvider({ drizzle, children, ...rest }: Props) {
  return (
    <drizzleReactHooks.DrizzleProvider drizzle={drizzle}>
      <Initializer drizzle={drizzle} {...rest}>
        {children}
      </Initializer>
    </drizzleReactHooks.DrizzleProvider>
  );
}

/**
 * This fixes issue that caused drizzle to not initialize when moving between pages using react router.
 * Drizzle wasn't able to find that injected web3 is loaded.
 * @param props
 * @constructor
 */
function Initializer(props: Props) {
  const drizzle = useDrizzle();
  const state = drizzleReactHooks.useDrizzleState(a => a);

  const location = useLocation();

  useEffect(() => {
    if (state.web3.status === '' && isObjectEmpty(drizzle.web3)) {
      drizzle.store.dispatch({
        type: 'DRIZZLE_INITIALIZING',
        drizzle: drizzle,
        options: drizzle.options,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location /*, drizzle.web3, state.web3.status, state.web3, drizzle*/]);

  return <>{props.children}</>;
}
