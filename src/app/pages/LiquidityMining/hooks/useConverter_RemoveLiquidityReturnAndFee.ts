import { Asset } from 'types/asset';
import { getAmmContractName } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../../../hooks/useCacheCallWithValue';

export function useConverter_RemoveLiquidityReturnAndFee(
  pool: Asset,
  poolToken: string,
  amount: string,
) {
  return useCacheCallWithValue<[string, string]>(
    getAmmContractName(pool),
    'removeLiquidityReturnAndFee',
    ['0', '0'],
    poolToken,
    amount,
  );
}
