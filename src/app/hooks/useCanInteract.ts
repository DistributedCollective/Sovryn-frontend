import { useAccount, useIsConnected } from './useAccount';
import { useSelector } from 'react-redux';
import { selectWalletProvider } from '../containers/WalletProvider/selectors';
import { selectTransactionArray } from '../../store/global/transactions-store/selectors';
import { useEffect, useState } from 'react';
import { TxStatus } from '../../store/global/transactions-store/types';

// For disabling buttons while check is in progress, user not yet connected and etc.
export function useCanInteract() {
  const isConnected = useIsConnected();
  const account = useAccount();
  const { whitelist } = useSelector(selectWalletProvider);
  const tx = useSelector(selectTransactionArray);
  const [canSendTx, setCanSendTx] = useState(false);

  useEffect(() => {
    // Only allow new transactions to be send if current account has no more than 4 pending transactions
    if (account) {
      setCanSendTx(
        tx.filter(
          item =>
            (item.status === TxStatus.PENDING ||
              item.status === TxStatus.PENDING_FOR_USER) &&
            item.from === account,
        ).length <= 4,
      );
    }
  }, [tx, account]);
  return (
    ((isConnected && !whitelist.enabled) ||
      (isConnected && whitelist.loaded && whitelist.whitelisted)) &&
    canSendTx
  );
}
