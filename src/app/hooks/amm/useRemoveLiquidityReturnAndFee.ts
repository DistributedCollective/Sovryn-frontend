import type { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';
import { useCacheCallToWithValue } from '../chain/useCacheCallToWithValue';

export function useRemoveLiquidityReturnAndFee(
  pool: AmmLiquidityPool,
  poolToken: string,
  amount: string,
) {
  return useCacheCallToWithValue(
    pool.converter,
    pool.converterAbi,
    'removeLiquidityReturnAndFee',
    ['-1', '-1'],
    [poolToken, amount],
  );
}
