import React, { useEffect, useMemo } from 'react';
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
import { TxRequestDialog } from 'app/components/TransactionDialog/TxRequestDialog';
import { currentChainId } from '../../../utils/classifiers';
import { actions } from './slice';
import { selectWalletProvider } from './selectors';

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
  const { bridgeChainId, signTypedRequired } = useSelector(
    selectWalletProvider,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.testTransactions());
  }, [dispatch]);

  const options = useMemo(() => {
    const customChain = bridgeChainId !== null;
    return {
      showWrongNetworkRibbon: false,
      remember: !customChain,
      chainId: customChain ? bridgeChainId : currentChainId,
      signTypedRequired,
      enableSoftwareWallet:
        process.env.REACT_APP_ENABLE_SOFTWARE_WALLET === 'true',
    };
  }, [signTypedRequired, bridgeChainId]);

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

  useEffect(() => {
    dispatch(actions.accountChanged(address || ''));
  }, [dispatch, address, wallet?.wallet]);

  useEffect(() => {
    dispatch(actions.chainChanged({ chainId, networkId: chainId }));
  }, [dispatch, chainId]);
  return null;
}
