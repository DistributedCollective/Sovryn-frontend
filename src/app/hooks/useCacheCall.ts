import { useEffect, useMemo, useState } from 'react';
import { startCall, observeCall, idHash } from 'utils/blockchain/cache';
import { getContract } from 'utils/blockchain/contract-helpers';

import { contractReader } from 'utils/sovryn/contract-reader';
import { ContractName } from 'utils/types/contracts';

import { Nullable } from '../../types';
import { useAccount, useBlockSync } from './useAccount';
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
  const syncBlock = useBlockSync();

  const [state, setState] = useState<CacheCallResponse<T>>({
    value: null,
    loading: false,
    error: null,
  });

  // @dev: generating id from contractName, methodName and args
  // @dev: ignoring account because contract response is the same for all accounts unless account is part of the args
  const hashedArgs = useMemo(
    () => idHash([getContract(contractName).address, methodName, args]),
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
      contractReader.callDirect(
        contractName,
        methodName,
        args,
        account || undefined,
      ),
    );

    return () => sub.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- prevent loop when arg has object
  }, [
    account,
    contractName,
    hashedArgs,
    isMounted,
    methodName,
    syncBlock,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(args),
  ]);

  return state;
}
