import Rsk from '@rsksmart/rsk3';
import { useSelector } from 'react-redux';
import { useWalletContext } from '@sovryn/react-wallet';
import { selectWalletProvider } from '../containers/WalletProvider/selectors';

export function useAccount() {
  const { address } = useWalletContext();
  return !!address ? Rsk.utils.toChecksumAddress(address) : '';
}

export function useIsConnected() {
  const { connected, address } = useWalletContext();
  return connected && !!address;
}

export function useBlockSync() {
  const { syncBlockNumber, blockNumber } = useSelector(selectWalletProvider);
  return syncBlockNumber || blockNumber;
}
