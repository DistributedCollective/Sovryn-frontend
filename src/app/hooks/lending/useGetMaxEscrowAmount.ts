import { Asset } from 'types/asset';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useGetMaxEscrowAmount(asset: Asset, leverageWeiAmount: string) {
  return useCacheCallWithValue(
    getLendingContractName(asset),
    'getMaxEscrowAmount',
    '0',
    leverageWeiAmount,
  );
}
