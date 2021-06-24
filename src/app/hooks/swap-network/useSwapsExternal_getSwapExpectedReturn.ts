import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { Asset } from 'types';
import { getTokenContract } from '../../../utils/blockchain/contract-helpers';

export function useSwapsExternal_getSwapExpectedReturn(
  sourceToken: Asset,
  destToken: Asset,
  sourceTokenAmount: string,
) {
  return useCacheCallWithValue(
    'swapsExternal',
    'getSwapExpectedReturn',
    '0',
    getTokenContract(sourceToken).address,
    getTokenContract(destToken).address,
    sourceTokenAmount,
  );
}
