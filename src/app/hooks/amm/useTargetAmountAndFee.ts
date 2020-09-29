import { Asset } from 'types/asset';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useTargetAmountAndFee(
  sourceToken: Asset,
  targetToken: Asset,
  amount: string,
) {
  return useCacheCallWithValue(
    'liquidityProtocol',
    'targetAmountAndFee',
    ['0', '0'],
    getTokenContract(sourceToken).address,
    getTokenContract(targetToken).address,
    amount,
  );
}
