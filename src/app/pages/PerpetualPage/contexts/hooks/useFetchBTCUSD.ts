import { useAccount } from 'app/hooks/useAccount';
import { useBridgeNetworkMultiCall } from 'app/hooks/useBridgeNetworkMultiCall';
import { MultiCallData } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { useMemo } from 'react';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from 'utils/dictionaries/perpetual-pair-dictionary';
import { usePerpetual_queryLiqPoolId } from '../../hooks/usePerpetual_queryLiqPoolId';
import { PERPETUAL_CHAIN } from '../../types';
import { FetchResult, getMultiCallData } from '../PerpetualQueriesContext';

const pairId = PerpetualPairDictionary.get(PerpetualPairType.BTCUSD).id;

export const useFetchBTCUSD = (): FetchResult => {
  const account = useAccount();
  const { result: poolId } = usePerpetual_queryLiqPoolId(pairId);

  const multiCallData: MultiCallData[][] = useMemo(
    () => getMultiCallData([poolId], account),
    [account, poolId],
  );

  const {
    result: firstResult,
    refetch: firstRefetch,
  } = useBridgeNetworkMultiCall(PERPETUAL_CHAIN, multiCallData[0]);

  return {
    firstResult,
    firstRefetch,
  };
};
