import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useWalletContext } from '@sovryn/react-wallet';
import { web3Wallets } from '@sovryn/wallet';
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
          item.from.toLowerCase() === address.toLowerCase(),
      ).length <= 4
    );
  }, [tx, address]);

  const testChain = useMemo(() => {
    if (!connected) return false;
    if (!web3Wallets.includes(wallet.providerType)) return true;
    return wallet.chainId === currentChainId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, JSON.stringify(wallet)]);

  if (ignoreWhitelist) {
    return connected && testTxCount && testChain;
  }

  return testWhitelist && testTxCount && testChain && connected;
}
