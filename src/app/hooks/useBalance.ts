import { useEffect, useState } from 'react';
import { Sovryn } from '../../utils/sovryn';
import { useSelector } from 'react-redux';
import { selectWalletProvider } from '../containers/WalletProvider/selectors';
import { useAccount } from './useAccount';
import { useIsMounted } from './useIsMounted';

export function useBalance() {
  const isMounted = useIsMounted();
  const { syncBlockNumber } = useSelector(selectWalletProvider);
  const address = useAccount();
  const [state, setState] = useState({
    value: '0',
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (address) {
      if (isMounted()) {
        setState(prevState => ({ ...prevState, loading: true, error: null }));
      }
      Sovryn.getWeb3()
        .eth.getBalance(address)
        .then(balance => {
          if (isMounted()) {
            setState(prevState => ({
              ...prevState,
              value: balance,
              loading: false,
              error: null,
            }));
          }
        })
        .catch(error => {
          if (isMounted()) {
            setState(prevState => ({ ...prevState, error }));
          }
        });
    } else {
      setState(prevState => ({ ...prevState, loading: false }));
    }
  }, [address, isMounted, syncBlockNumber]);
  return state;
}
