import { useCallback, useEffect, useState, useMemo } from 'react';
import { Chain } from '../../types';
import {
  MultiCallData,
  bridgeNetwork,
  MultiCallResult,
} from '../pages/BridgeDepositPage/utils/bridge-network';

/**
 * Important: multiCallData must be static or generated with useMemo or similar, to prevent unnecessary calls.
 * Makes an aggregated RPC call and allows for refetching.
 */
export const useBridgeNetworkMultiCall = (
  chain: Chain,
  multiCallData: MultiCallData[],
  immediate: boolean = true,
) => {
  const [result, setResult] = useState<MultiCallResult>();

  const fetch = useCallback(async () => {
    const result = await bridgeNetwork.multiCall(chain, multiCallData);
    setResult(result);
    return result;
  }, [chain, multiCallData]);

  useEffect(() => {
    if (immediate) {
      fetch().catch(console.error);
    }
  }, [fetch, immediate]);

  return useMemo(
    () => ({
      refetch: fetch,
      result,
    }),
    [fetch, result],
  );
};
