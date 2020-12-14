import { useSelector } from 'react-redux';
import { selectWalletProvider } from 'app/containers/WalletProvider/selectors';
import { useIsConnected } from '../useAccount';

// For showing notifications when check is completed and user is not whitelisted for sure.
export function useIsWhitelisted() {
  const isConnected = useIsConnected();
  const { whitelist } = useSelector(selectWalletProvider);
  if (!isConnected || !whitelist.enabled || !whitelist.loaded) {
    return true;
  }
  return whitelist.whitelisted;
}
