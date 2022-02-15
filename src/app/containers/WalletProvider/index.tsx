/**
 *
 * WalletConnector
 *
 */

import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import crypto from 'crypto';
import {
  useWalletContext,
  WalletProvider as SovrynWallet,
} from '@sovryn/react-wallet';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
  eventsSlice,
  reducer as eventsReducer,
} from 'store/global/events-store/slice';
import { eventsStateSaga } from 'store/global/events-store/saga';
import {
  transactionsSlice,
  reducer as transactionsReducer,
} from 'store/global/transactions-store/slice';
import { transactionsStateSaga } from 'store/global/transactions-store/saga';
import { reducer, sliceKey } from './slice';
import { walletProviderSaga } from './saga';
import { selectRequestDialogState } from '../../../store/global/transactions-store/selectors';
import { TxRequestDialog } from './components/TxRequestDialog';
import { currentChainId, currentNetwork } from '../../../utils/classifiers';
import { actions } from './slice';
import { useEvent } from 'app/hooks/useAnalytics';
import { selectWalletProvider } from './selectors';
import { useLocation } from 'react-router-dom';
import { intercomUpdate } from 'utils/intercom';
import { detectWeb3Wallet } from 'utils/helpers';

interface Props {
  children: React.ReactNode;
}

export function WalletProvider(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: walletProviderSaga });

  useInjectReducer({ key: eventsSlice, reducer: eventsReducer });
  useInjectSaga({ key: eventsSlice, saga: eventsStateSaga });

  useInjectReducer({ key: transactionsSlice, reducer: transactionsReducer });
  useInjectSaga({ key: transactionsSlice, saga: transactionsStateSaga });

  const requestDialog = useSelector(selectRequestDialogState);
  const { bridgeChainId } = useSelector(selectWalletProvider);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(actions.testTransactions());
  }, [dispatch]);

  const options = useMemo(() => {
    const isCrossChain = location.pathname.startsWith('/cross-chain');
    const customChain = bridgeChainId !== null && isCrossChain;
    return {
      showWrongNetworkRibbon: false,
      remember: !customChain,
      chainId: customChain ? bridgeChainId : currentChainId,
      enableSoftwareWallet:
        process.env.REACT_APP_ENABLE_SOFTWARE_WALLET === 'true',
    };
  }, [bridgeChainId, location]);

  return (
    <SovrynWallet options={options}>
      <WalletWatcher />
      <>{props.children}</>
      <TxRequestDialog {...requestDialog} />
    </SovrynWallet>
  );
}

function WalletWatcher() {
  const dispatch = useDispatch();
  const { wallet, address, chainId } = useWalletContext();
  const setEvent = useEvent();

  useEffect(() => {
    if (address) {
      setEvent({
        category: 'Wallet',
        action: 'Engaged',
        label: `${
          wallet?.wallet?.getWalletType() || 'unknown'
        }:${crypto.createHash('md5').update(address).digest('hex')}`,
      });

      intercomUpdate({
        'Wallet address': address,
        'Wallet type': detectWeb3Wallet(),
        'Wallet network': wallet?.wallet?.chainId?.toString() || 'unknown',
        Environment: currentNetwork,
      });
    }

    dispatch(actions.accountChanged(address || ''));
  }, [dispatch, address, setEvent, wallet?.wallet]);

  useEffect(() => {
    dispatch(actions.chainChanged({ chainId, networkId: chainId }));
  }, [dispatch, chainId]);
  return null;
}
