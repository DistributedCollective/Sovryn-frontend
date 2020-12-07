import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { Asset } from '../../../types/asset';
import { getAmmContractName } from '../../../utils/blockchain/contract-helpers';

export function useLiquidationLimit(asset: Asset, poolTokenAddress: string) {
  return useCacheCallWithValue(
    getAmmContractName(asset),
    'liquidationLimit',
    '0',
    poolTokenAddress,
  );
}
