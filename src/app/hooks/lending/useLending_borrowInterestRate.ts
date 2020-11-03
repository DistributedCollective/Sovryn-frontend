import { Asset } from 'types/asset';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useLending_borrowInterestRate(
  loanToken: Asset,
  weiAmount: string,
) {
  return useCacheCallWithValue(
    getLendingContractName(loanToken),
    'borrowInterestRate',
    '0',
    weiAmount,
  );
}
