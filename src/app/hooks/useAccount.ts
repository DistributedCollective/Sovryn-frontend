import { useSelector } from 'react-redux';
import { selectWalletProvider } from '../containers/WalletProvider/selectors';

export function useAccount() {
  const { address } = useSelector(selectWalletProvider);
  return address;
}

export function useIsConnected() {
  const { connected, chainId } = useSelector(selectWalletProvider);
  return connected && chainId === Number(process.env.REACT_APP_NETWORK_ID);
}
