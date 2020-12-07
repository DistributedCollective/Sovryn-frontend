import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { Asset } from '../../../types/asset';
import { getAmmContractName } from '../../../utils/blockchain/contract-helpers';

export function useEffectiveTokensRate(
  asset: Asset,
  reserve1Weight: string,
  reserve2Weight: string,
) {
  return useCacheCallWithValue(
    getAmmContractName(asset),
    'effectiveReserveWeights',
    ['0', '0'],
    reserve1Weight,
    reserve2Weight,
  );
}
