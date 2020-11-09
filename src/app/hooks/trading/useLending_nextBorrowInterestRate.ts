import { Asset } from 'types/asset';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useLending_nextBorrowInterestRate(
  loanToken: Asset,
  weiAmount: string,
) {
  return useCacheCallWithValue(
    getLendingContractName(loanToken),
    'nextBorrowInterestRate',
    '0',
    weiAmount,
  );
}
