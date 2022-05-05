import { ChainId } from '../../types';
import { GsnProvider } from './GsnProvider';
import { walletService } from '@sovryn/react-wallet';
import { isWeb3Wallet } from '@sovryn/wallet';

class GsnNetwork {
  private providers = new Map<ChainId, Map<string, GsnProvider>>();

  getProvider(chainId: ChainId, paymaster: string): GsnProvider {
    let paymasterMap = this.providers.get(chainId);
    if (!paymasterMap) {
      paymasterMap = new Map<string, GsnProvider>();
      this.providers.set(chainId, paymasterMap);
    }

    let provider = paymasterMap.get(paymaster);
    if (!provider) {
      provider = new GsnProvider(chainId, paymaster);
      paymasterMap.set(paymaster, provider);
    }
    return provider;
  }

  isSupportedByConnectedWallet() {
    return (
      typeof window.ethereum !== 'undefined' &&
      walletService.providerType &&
      isWeb3Wallet(walletService.providerType)
    );
  }
}

export const gsnNetwork = new GsnNetwork();
