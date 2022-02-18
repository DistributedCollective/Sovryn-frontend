import { useContext, useMemo } from 'react';
import { WalletContext } from '@sovryn/react-wallet';
import { InjectedWalletProvider, isWeb3Wallet } from '@sovryn/wallet';

export function useDetectWeb3ChainId(expectedChainId: number) {
  const { wallet } = useContext(WalletContext);
  return useMemo(() => {
    if (isWeb3Wallet(wallet.providerType!)) {
      const provider = InjectedWalletProvider.getProvider(expectedChainId);
      if (provider) {
        return parseInt(provider.chainId);
      }
    }
    return wallet.chainId;
  }, [expectedChainId, wallet.providerType, wallet.chainId]);
}
