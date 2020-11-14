import { useIsConnected } from './useAccount';
import { useSelector } from 'react-redux';
import { selectWalletProvider } from '../containers/WalletProvider/selectors';

// For disabling buttons while check is in progress, user not yet connected and etc.
export function useCanInteract() {
  const isConnected = useIsConnected();
  const { whitelist } = useSelector(selectWalletProvider);
  return (
    (isConnected && !whitelist.enabled) ||
    (isConnected && whitelist.loaded && whitelist.whitelisted)
  );
}
