import { useAccount } from './useAccount';
import { Sovryn } from '../../utils/sovryn';
import { useEffect, useState } from 'react';

export function useBalance() {
  const account = useAccount();
  const [state, setState] = useState({
    value: '0',
    loading: true,
    error: null,
  });

  useEffect(() => {
    console.log('get balance!');
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
  }, [account]);
  return state;
}
