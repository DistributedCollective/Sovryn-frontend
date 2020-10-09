import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectWalletProvider } from '../containers/WalletProvider/selectors';
import { Sovryn } from '../../utils/sovryn';
import { ContractName } from '../../utils/types/contracts';

interface CacheCallResponse {
  value: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Calls blockchain on read node to get data.
 * Updates data by calling blockchain again if any of method args changed.
 * Updates if syncBlockNumber changes (changes if user wallet or any of contracts txs is found in new blockchain block)
 * Note: Right now there is no actual caching.
 * TODO: Add actual result caching to prevent calling blockchain multiple times if hook was used with same data.
 * @param contractName
 * @param methodName
 * @param args
 */
export function useCacheCall(
  contractName: ContractName,
  methodName: string,
  ...args: any
): CacheCallResponse {
  const { syncBlockNumber } = useSelector(selectWalletProvider);

  const [state, setState] = useState({
    value: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    try {
      Sovryn.contracts[contractName].methods[methodName](...args)
        .call()
        .then(value => {
          setState(prevState => ({
            ...prevState,
            value,
            loading: false,
            error: null,
          }));
        })
        .catch(() => {
          // todo add logger?
          // silence...
        });
    } catch (error) {
      // todo add winston logger?
      setState(prevState => ({ ...prevState, loading: false, error }));
    }

    return () => {
      // todo: find a way to cancel contract call
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractName, methodName, syncBlockNumber, JSON.stringify(args)]);

  return state;
}
