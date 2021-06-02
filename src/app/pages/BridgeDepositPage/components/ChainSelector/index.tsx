/**
 *
 * BridgeDepositPage
 *
 */

import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useWalletContext } from '@sovryn/react-wallet';

import { reducer, sliceKey, actions } from '../../slice';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions as walletProviderActions } from 'app/containers/WalletProvider/slice';
import { selectBridgeDepositPage } from '../../selectors';

interface Props {}

export function ChainSelector(props: Props) {
  const bridgeDepositPage = useSelector(selectBridgeDepositPage);
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

  const selectNetwork = useCallback(
    (chainId: number) => {
      console.log('select network');
      dispatch(actions.selectNetwork({ chainId, walletContext }));
    },
    [dispatch, walletContext],
  );

  return (
    <div>
      <h1>Select Network to deposit from</h1>
      <div>
        <button onClick={() => selectNetwork(1)}>ETH</button>
        <button onClick={() => selectNetwork(101)}>BNB</button>
      </div>
    </div>
  );
}
