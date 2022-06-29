import { useAccount } from 'app/hooks/useAccount';
import { useBridgeNetworkMultiCall } from 'app/hooks/useBridgeNetworkMultiCall';
import { MultiCallData } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { useMemo } from 'react';
import { PerpetualPairDictionary } from 'utils/dictionaries/perpetual-pair-dictionary';
import { usePerpetual_queryLiqPoolId } from '../../hooks/usePerpetual_queryLiqPoolId';
import { PERPETUAL_CHAIN } from '../../types';
import { FetchResult, getMultiCallData } from '../PerpetualQueriesContext';

const pairIds = PerpetualPairDictionary.list().map(item => item.id);

export const useFetchAllPairs = (): FetchResult => {
  const account = useAccount();

  const { result: firstPoolId } = usePerpetual_queryLiqPoolId(pairIds[0]);

  const { result: secondPoolId } = usePerpetual_queryLiqPoolId(pairIds[1]);

  const multiCallData: MultiCallData[][] = useMemo(
    () => getMultiCallData([firstPoolId, secondPoolId], account),
    [account, firstPoolId, secondPoolId],
  );

  const {
    result: firstResult,
    refetch: firstRefetch,
  } = useBridgeNetworkMultiCall(PERPETUAL_CHAIN, multiCallData[0]);

  const {
    result: secondResult,
    refetch: secondRefetch,
  } = useBridgeNetworkMultiCall(PERPETUAL_CHAIN, multiCallData[1]);

  return {
    firstResult,
    firstRefetch,
    secondResult,
    secondRefetch,
  };
};
