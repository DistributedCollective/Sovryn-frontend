import { ethers } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { startCall, observeCall } from 'utils/blockchain/cache';

import { contractReader } from 'utils/sovryn/contract-reader';
import { ContractName } from 'utils/types/contracts';

import { Nullable } from '../../types';
import { useAccount } from './useAccount';
import { useIsMounted } from './useIsMounted';

export interface CacheCallResponse<T = string> {
  value: Nullable<T>;
  loading: boolean;
  error: Nullable<string>;
}

/**
 * Calls blockchain on read node to get data.
 * Updates data by calling blockchain again if any of method args changed.
 * @param contractName
 * @param methodName
 * @param args
 */
export function useCacheCall<T = any>(
  contractName: ContractName,
  methodName: string,
  ...args: any
): CacheCallResponse<T> {
  const isMounted = useIsMounted();
  const account = useAccount();

  const [state, setState] = useState<CacheCallResponse<T>>({
    value: null,
    loading: false,
    error: null,
  });

  // @dev: generating id from contractName, methodName and args
  // @dev: ignoring account because contract response is the same for all accounts unless account is part of the args
  const hashedArgs = useMemo(
    () =>
      ethers.utils.hashMessage(
        JSON.stringify([contractName, methodName, args]),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [contractName, methodName, JSON.stringify(args)],
  );

  useEffect(() => {
    if (!isMounted()) {
      return;
    }

    const sub = observeCall(hashedArgs).subscribe(e =>
      setState(e.result as CacheCallResponse<T>),
    );

    startCall(hashedArgs, () =>
      contractReader.call(contractName, methodName, args, account || undefined),
    );

    return () => sub.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- prevent loop when arg has object
  }, [
    account,
    contractName,
    hashedArgs,
    isMounted,
    methodName,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(args),
  ]);

  return state;
}
