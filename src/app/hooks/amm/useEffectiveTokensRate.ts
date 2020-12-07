import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { Asset } from '../../../types/asset';
import { getAmmContractName } from '../../../utils/blockchain/contract-helpers';

export function useEffectiveTokensRate(
  asset: Asset,
  numerator: string,
  denominator: string,
) {
  return useCacheCallWithValue(
    getAmmContractName(asset),
    'effectiveTokensRate',
    ['0', '0'],
    numerator,
    denominator,
  );
}
