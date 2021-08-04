import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useWalletContext } from '@sovryn/react-wallet';
import { isWeb3Wallet } from '@sovryn/wallet';
import { selectWalletProvider } from '../containers/WalletProvider/selectors';
import { selectTransactionArray } from '../../store/global/transactions-store/selectors';
import { TxStatus } from '../../store/global/transactions-store/types';
import { currentChainId } from '../../utils/classifiers';

// For disabling buttons while check is in progress, user not yet connected and etc.
export function useCanInteract(ignoreWhitelist: boolean = false) {
  const { address, connected, wallet } = useWalletContext();

  const { whitelist } = useSelector(selectWalletProvider);
  const tx = useSelector(selectTransactionArray);

  const testWhitelist = useMemo(() => {
    return (
      (connected && !whitelist.enabled) ||
      (connected && whitelist.loaded && whitelist.whitelisted)
    );
  }, [connected, whitelist]);

  const testTxCount = useMemo(() => {
    return (
      tx.filter(
        item =>
          (item.status === TxStatus.PENDING ||
            item.status === TxStatus.PENDING_FOR_USER) &&
          item.from.toLowerCase() === address?.toLowerCase(),
      ).length <= 4
    );
  }, [tx, address]);

  const isTestChain = useMemo(() => {
    if (!connected) {
      return false;
    }
    if (!isWeb3Wallet(wallet.providerType!)) return true;
    return wallet.chainId === currentChainId;
  }, [connected, wallet.providerType, wallet.chainId]);

  if (ignoreWhitelist) {
    return connected && testTxCount && isTestChain;
  }

  return testWhitelist && testTxCount && isTestChain && connected;
}
