import { usePromise } from './usePromise';
import type { WalletContextType } from '@sovryn/react-wallet/contexts/WalletContext';

import '@sovryn/react-wallet/index.css';

const reactWalletPromise = import('@sovryn/react-wallet');

export const useReactWallet = () => {
  const { result } = usePromise(() => reactWalletPromise, []);

  return result;
};

export const useReactWalletContext = (): WalletContextType | undefined => {
  const { result } = usePromise(() => reactWalletPromise, []);

  return result?.useWalletContext();
};

export const useReactWalletService = () => {
  const { result } = usePromise(() => reactWalletPromise, []);

  return result?.walletService;
};
