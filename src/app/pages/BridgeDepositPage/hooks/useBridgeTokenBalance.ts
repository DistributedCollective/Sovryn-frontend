import { useEffect, useState } from 'react';
import { Chain } from 'types';
import erc20Token from 'utils/blockchain/abi/erc20.json';

import { AssetModel } from '../types/asset-model';
import { bridgeNetwork } from '../utils/bridge-network';
import { LoadingValueState } from '../../../../types/loading-value-state';
import { CrossBridgeAsset } from '../types/cross-bridge-asset';

export function useBridgeTokenBalance(
  targetChain: Chain,
  asset: AssetModel,
  targetAsset: CrossBridgeAsset,
) {
  const [state, setState] = useState<LoadingValueState<string | null>>({
    value: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!asset.usesAggregator || asset.aggregatorMints) {
      setState(prevState => ({
        ...prevState,
        loading: true,
        value: null,
        error: null,
      }));
      return;
    }

    setState(prevState => ({ ...prevState, loading: true }));
    bridgeNetwork
      .call(
        targetChain,
        asset.bridgeTokenAddresses.get(targetAsset) ||
          asset.tokenContractAddress,
        erc20Token,
        'balanceOf',
        [asset.aggregatorContractAddress?.toLowerCase()],
      )
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
  }, [asset, targetAsset, targetChain]);
  return state;
}
