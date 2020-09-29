import { useEffect, useState } from 'react';
import { useAccount } from './useAccount';
import { Sovryn } from '../../utils/sovryn';

export function useBalance() {
  const account = useAccount();
  const [state, setState] = useState({
    value: '0',
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (account) {
      setState(prevState => ({ ...prevState, loading: true, error: null }));
      Sovryn.getWeb3()
        .eth.getBalance(account)
        .then(balance => {
          setState(prevState => ({
            ...prevState,
            value: balance,
            loading: false,
            error: null,
          }));
        })
        .catch(error => {
          setState(prevState => ({ ...prevState, error }));
        });
    } else {
      setState(prevState => ({ ...prevState, loading: false }));
    }
  }, [account]);
  return state;
}
