import { Asset } from 'types/asset';
import {
  getAmmContractName,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useTargetAmountAndFee(
  pool: Asset,
  sourceToken: Asset,
  targetToken: Asset,
  amount: string,
) {
  return useCacheCallWithValue(
    getAmmContractName(pool),
    'targetAmountAndFee',
    ['0', '0'],
    getTokenContract(sourceToken).address,
    getTokenContract(targetToken).address,
    amount,
  );
}
