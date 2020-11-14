/**
 *
 * WalletConnector
 *
 */

import React from 'react';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { walletProviderSaga } from './saga';
// import { useDispatch, useSelector } from 'react-redux';
// import { selectWalletProvider } from './selectors';
// import { Dialog } from '../Dialog/Loadable';

interface Props {
  children: React.ReactNode;
}

export function WalletProvider(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: walletProviderSaga });

  // const { whitelist } = useSelector(selectWalletProvider);
  // const dispatch = useDispatch();

  return (
    <>
      {props.children}
      {/*{!whitelist.whitelisted && (*/}
      {/*  <Dialog*/}
      {/*    isOpen={whitelist.isDialogOpen}*/}
      {/*    onClose={() => dispatch(actions.whitelistDialog(false))}*/}
      {/*  >*/}
      {/*    Your wallet is not whitelisted.*/}
      {/*  </Dialog>*/}
      {/*)}*/}
    </>
  );
}
