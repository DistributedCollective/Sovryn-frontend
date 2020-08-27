import { Asset } from 'types/asset';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useLendingInterestRate(asset: Asset, weiAmount: string) {
  return useCacheCallWithValue(
    getLendingContractName(asset),
    'nextSupplyInterestRate',
    '0',
    weiAmount,
  );
}
