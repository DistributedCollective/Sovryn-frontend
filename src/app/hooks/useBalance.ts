import { useEffect, useMemo, useState } from 'react';
import { Sovryn } from '../../utils/sovryn';
import { useAccount, useBlockSync } from './useAccount';
import { useIsMounted } from './useIsMounted';
import { AssetBalanceOfResponse } from './useAssetBalanceOf';
import {
  getContract,
  getTokenContractName,
} from 'utils/blockchain/contract-helpers';
import { Asset } from 'types';
import {
  CacheCallOptions,
  idHash,
  observeCall,
  startCall,
} from 'utils/blockchain/cache';

export function useBalance(
  options?: Partial<CacheCallOptions>,
): AssetBalanceOfResponse<string> {
  const account = useAccount();
  const isMounted = useIsMounted();
  const syncBlock = useBlockSync();

  const contractName = useMemo(() => getTokenContractName(Asset.RBTC), []);

  const [state, setState] = useState<AssetBalanceOfResponse<string>>({
    value: '0',
    loading: false,
    error: null,
  });

  const hashedArgs = useMemo(
    () =>
      idHash([
        getContract('RBTC_token').address,
        'nativeBalance',
        account,
        syncBlock,
      ]),
    [account, syncBlock],
  );

  useEffect(() => {
    if (!isMounted() || !account) {
      return;
    }

    const sub = observeCall(hashedArgs).subscribe(e =>
      setState(e.result as AssetBalanceOfResponse<string>),
    );

    startCall(
      hashedArgs,
      () => Sovryn.getWeb3().eth.getBalance(account),
      options,
    );

    return () => sub.unsubscribe();
  }, [account, contractName, hashedArgs, isMounted, options]);

  return useMemo(
    () => ({ ...state, value: state.value === null ? '0' : state.value }),
    [state],
  );
}
