import { Asset } from 'types/asset';
import {
  getContract,
  getTokenContractName,
} from 'utils/blockchain/contract-helpers';
import { useAccount, useBlockSync } from './useAccount';
import { useEffect, useMemo, useState } from 'react';
import { useIsMounted } from './useIsMounted';
import {
  CacheCallOptions,
  idHash,
  observeCall,
  startCall,
} from 'utils/blockchain/cache';
import { CacheCallResponse } from './useCacheCall';
import { contractReader } from 'utils/sovryn/contract-reader';
import { Sovryn } from 'utils/sovryn';

export interface AssetBalanceOfResponse<T>
  extends Omit<CacheCallResponse, 'value'> {
  value: T;
}

/**
 * Returns balance of an asset
 * BTC is actual rBTC and not a token.
 * @param asset
 */
export function useAssetBalanceOf(
  asset: Asset,
  options?: Partial<CacheCallOptions>,
): AssetBalanceOfResponse<string> {
  const account = useAccount();
  const isMounted = useIsMounted();
  const syncBlock = useBlockSync();
  const contractName = useMemo(() => getTokenContractName(asset), [asset]);

  const [state, setState] = useState<AssetBalanceOfResponse<string>>({
    value: '0',
    loading: false,
    error: null,
  });

  const hashedArgs = useMemo(
    () =>
      idHash([
        getContract(contractName).address,
        asset === Asset.RBTC ? 'nativeBalance' : 'balanceOf',
        account,
        syncBlock,
      ]),
    [contractName, asset, account, syncBlock],
  );

  useEffect(() => {
    if (!isMounted() || !account) {
      return;
    }

    const sub = observeCall(hashedArgs).subscribe(e =>
      setState(e.result as AssetBalanceOfResponse<string>),
    );

    const callback =
      asset === Asset.RBTC
        ? () => Sovryn.getWeb3().eth.getBalance(account)
        : () => contractReader.callDirect(contractName, 'balanceOf', [account]);

    startCall(hashedArgs, callback, options);

    return () => sub.unsubscribe();
  }, [account, asset, contractName, hashedArgs, isMounted, options]);

  return useMemo(
    () => ({ ...state, value: state.value === null ? '0' : state.value }),
    [state],
  );
}
