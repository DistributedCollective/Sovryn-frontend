/**
 *
 * WalletConnector
 *
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { FastBtcForm } from '../FastBtcForm/Loadable';
import {
  sliceKey as btcSlice,
  reducer as btcReducer,
} from '../FastBtcForm/slice';
import { fastBtcFormSaga } from '../FastBtcForm/saga';
import { currentChainId } from '../../../utils/classifiers';
import { actions } from './slice';

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

  useInjectReducer({ key: btcSlice, reducer: btcReducer });
  useInjectSaga({ key: btcSlice, saga: fastBtcFormSaga });

  const requestDialog = useSelector(selectRequestDialogState);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.testTransactions());
  }, [dispatch]);

  return (
    <SovrynWallet chainId={currentChainId} remember>
      <WalletWatcher />
      <>{props.children}</>
      <TxRequestDialog {...requestDialog} />
      <FastBtcForm />
    </SovrynWallet>
  );
}

function WalletWatcher() {
  const dispatch = useDispatch();
  const { address, chainId } = useWalletContext();
  useEffect(() => {
    dispatch(actions.accountChanged(address));
  }, [dispatch, address]);
  useEffect(() => {
    dispatch(actions.chainChanged({ chainId, networkId: chainId }));
  }, [dispatch, chainId]);
  return <></>;
}
