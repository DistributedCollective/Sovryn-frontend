import { Asset } from '../../../types/asset';
import { useCacheCallWithValue } from '../useCacheCallWithValue';
import {
  getLendingContractName,
  getTokenContract,
} from '../../../utils/blockchain/contract-helpers';

export function useLending_transactionLimit(loanToken: Asset, asset: Asset) {
  return useCacheCallWithValue(
    getLendingContractName(loanToken),
    'transactionLimit',
    '0',
    getTokenContract(asset).address,
  );
}
