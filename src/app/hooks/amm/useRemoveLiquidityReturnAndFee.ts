import { Asset } from 'types/asset';
import { getAmmContractName } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useRemoveLiquidityReturnAndFee(
  pool: Asset,
  poolToken: string,
  amount: string,
) {
  return useCacheCallWithValue(
    getAmmContractName(pool),
    'removeLiquidityReturnAndFee',
    ['0', '0'],
    poolToken,
    amount,
  );
}
