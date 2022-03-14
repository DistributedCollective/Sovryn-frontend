import type { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';
import { useCacheCallToWithValue } from '../../../hooks/chain/useCacheCallToWithValue';

export function useMining_RemoveLiquidityReturnAndFee(
  pool: AmmLiquidityPool,
  poolToken: string,
  amount: string,
) {
  return useCacheCallToWithValue(
    pool.converter,
    pool.converterAbi,
    'removeLiquidityReturnAndFee',
    ['0', '0'],
    [poolToken, amount],
  );
}
