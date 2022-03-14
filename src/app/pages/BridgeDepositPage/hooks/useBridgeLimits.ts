import { useEffect, useState } from 'react';

import { Chain } from 'types';
import allowTokensAbi from 'utils/blockchain/abi/AllowTokensAbi.json';
import bridgeAbi from 'utils/blockchain/abi/BridgeAbi.json';

import { LoadingValueState } from '../../../../types/loading-value-state';
import { useAccount } from '../../../hooks/useAccount';
import { BridgeDictionary } from '../dictionaries/bridge-dictionary';
import { AssetModel } from '../types/asset-model';
import { BridgeModel } from '../types/bridge-model';
import { bridgeNetwork } from '../utils/bridge-network';

interface Result {
  blockNumber: number;
  returnData: {
    spentToday: string;
    dailyLimit: string;
    getMinPerToken: string;
    getFeePerToken: string;
    getMaxTokensAllowed: string;
  };
}

const emptyState = {
  blockNumber: 0,
  returnData: {
    spentToday: '0',
    dailyLimit: '0',
    getMinPerToken: '0',
    getFeePerToken: '0',
    getMaxTokensAllowed: '0',
  },
};

export function useBridgeLimits(
  chain: Chain,
  targetChain: Chain,
  asset: AssetModel,
) {
  const account = useAccount();
  const [state, setState] = useState<LoadingValueState<Result>>({
    value: emptyState,
    loading: false,
    error: null,
  });

  const bridge = BridgeDictionary.get(chain, targetChain) as BridgeModel;

  useEffect(() => {
    setState(prevState => ({ ...prevState, loading: true }));
    bridgeNetwork
      .multiCall(chain, [
        {
          address: bridge.bridgeContractAddress,
          abi: bridgeAbi,
          fnName: 'spentToday',
          args: [],
          key: 'spentToday',
          parser: value => value[0].toString(),
        },
        {
          address: bridge.allowTokensContractAddress,
          abi: allowTokensAbi,
          fnName: 'dailyLimit',
          args: [],
          key: 'dailyLimit',
          parser: value => value[0].toString(),
        },
        {
          address: bridge.allowTokensContractAddress,
          abi: allowTokensAbi,
          fnName: 'getMinPerToken',
          args: [asset.bridgeTokenAddress],
          key: 'getMinPerToken',
          parser: value => value[0].toString(),
        },
        {
          address: bridge.allowTokensContractAddress,
          abi: allowTokensAbi,
          fnName: 'getFeePerToken',
          args: [asset.bridgeTokenAddress],
          key: 'getFeePerToken',
          parser: value => value[0].toString(),
        },
        {
          address: bridge.allowTokensContractAddress,
          abi: allowTokensAbi,
          fnName: 'getMaxTokensAllowed',
          args: [],
          key: 'getMaxTokensAllowed',
          parser: value => value[0].toString(),
        },
      ])
      .then(result => {
        setState(prevState => ({
          ...prevState,
          value: result as any,
          loading: false,
          error: null,
        }));
      })
      .catch(error => {
        console.error('e', error);
        setState(prevState => ({
          ...prevState,
          value: emptyState,
          loading: false,
          error,
        }));
      });
  }, [
    account,
    asset,
    bridge.allowTokensContractAddress,
    bridge.bridgeContractAddress,
    chain,
  ]);
  return state;
}
