import { useEffect, useRef, useState } from 'react';
import { AbiItem } from 'web3-utils';
import { Nullable } from 'types';

import { contractReader } from 'utils/sovryn/contract-reader';
import { useBlockSync } from '../useAccount';
import { CacheCallResponse } from '../useCacheCall';

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
export function useCacheCallTo<T = string>(
  to: string,
  abi: AbiItem | AbiItem[],
  methodName: string,
  args: any[],
): CacheCallResponse<T> {
  const syncBlockNumber = useBlockSync();

  const abiRef = useRef(abi);

  const [state, setState] = useState<CacheCallResponse<T>>({
    value: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    try {
      contractReader
        .callByAddress(to, abiRef.current, methodName, args)
        .then(response => {
          setState({
            value: (response as unknown) as Nullable<T>,
            loading: false,
            error: null,
          });
        })
        .catch(error => {
          // todo add logger?
          // silence...
          setState(prevState => ({
            ...prevState,
            loading: false,
            value: null,
            error,
          }));
        });
    } catch (error) {
      // todo add winston logger?
      setState({
        loading: false,
        value: null,
        error: (error as any)?.message || error,
      });
    }

    return () => {
      // todo: find a way to cancel contract call
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, methodName, syncBlockNumber, JSON.stringify(args)]);

  return state;
}
