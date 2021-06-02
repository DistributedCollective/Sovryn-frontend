/**
 *
 * BridgeDepositPage
 *
 */

import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useWalletContext } from '@sovryn/react-wallet';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions as walletProviderActions } from 'app/containers/WalletProvider/slice';

import { reducer, sliceKey, actions } from './slice';
import { selectBridgeDepositPage } from './selectors';
import { bridgeDepositPageSaga } from './saga';

interface Props {}

export function BridgeDepositPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: bridgeDepositPageSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const bridgeDepositPage = useSelector(selectBridgeDepositPage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  const location = useLocation<any>();
  const walletContext = useWalletContext();

  useEffect(() => {
    return () => {
      // Unset bridge seetings
      dispatch(walletProviderActions.setBridgeChainId(null));
      // dispatch(walletProviderActions.chainChanged(currentChainId));
      console.log('back to portfolio?');
    };
  }, [dispatch]);

  useEffect(() => {
    console.log(location);
  }, [location]);

  const selectNetwork = useCallback(
    (chainId: number) => {
      console.log('select network');
      dispatch(actions.selectNetwork({ chainId, walletContext }));
    },
    [dispatch, walletContext],
  );

  return (
    <>
      <div>
        <Link to="/wallet">Back to portfolio.</Link>
      </div>
      <div>Receiver address: {location?.state?.receiver}</div>
      <div>
        User Address: {walletContext.address} // {walletContext.chainId}
      </div>
      <div>
        <button onClick={() => selectNetwork(1)}>ETH</button>
        <button onClick={() => selectNetwork(101)}>BNB</button>
        <button onClick={() => selectNetwork(31)}>RSK</button>
      </div>
    </>
  );
}
