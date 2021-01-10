import Rsk from '@rsksmart/rsk3';
import { useSelector } from 'react-redux';
import { selectWalletProvider } from '../containers/WalletProvider/selectors';
import { currentChainId } from '../../utils/classifiers';

export function useAccount() {
  const { address } = useSelector(selectWalletProvider);
  return !!address ? Rsk.utils.toChecksumAddress(address) : '';
}

export function useIsConnected() {
  const { connected, chainId, address } = useSelector(selectWalletProvider);
  return connected && chainId === currentChainId && !!address;
}

export function useIsConnecting() {
  const { connecting } = useSelector(selectWalletProvider);
  return connecting;
}
