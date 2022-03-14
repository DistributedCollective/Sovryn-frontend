import { useEffect, useState } from 'react';
import { Chain } from 'types';
import erc20Token from 'utils/blockchain/abi/erc20.json';

import { AssetModel } from '../types/asset-model';
import { useAccount, useBlockSync } from '../../../hooks/useAccount';
import { bridgeNetwork } from '../utils/bridge-network';
import { LoadingValueState } from '../../../../types/loading-value-state';

export function useTokenBalance(chain: Chain, asset: AssetModel) {
  const account = useAccount();
  const blockSync = useBlockSync();
  const [state, setState] = useState<LoadingValueState<string>>({
    value: '0',
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!account) {
      return;
    }
    setState(prevState => ({ ...prevState, loading: true }));
    if (asset.isNative) {
      bridgeNetwork
        .getNode(chain)
        .getBalance(account.toLowerCase())
        .then(result =>
          setState(prevState => ({
            ...prevState,
            value: result.toString(),
            loading: false,
            error: null,
          })),
        )
        .catch(error =>
          setState(prevState => ({
            ...prevState,
            value: '0',
            loading: false,
            error,
          })),
        );
    } else {
      bridgeNetwork
        .call(chain, asset.tokenContractAddress, erc20Token, 'balanceOf', [
          account.toLowerCase(),
        ])
        .then(result =>
          setState(prevState => ({
            ...prevState,
            value: result.toString(),
            loading: false,
            error: null,
          })),
        )
        .catch(error =>
          setState(prevState => ({
            ...prevState,
            value: '0',
            loading: false,
            error,
          })),
        );
    }
  }, [account, asset, chain, blockSync]);
  return state;
}
