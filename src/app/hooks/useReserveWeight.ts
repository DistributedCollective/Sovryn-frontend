import type { Asset } from 'types';
import type { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
import { useCacheCallToWithValue } from './chain/useCacheCallToWithValue';

export function useReserveWeight(pool: AmmLiquidityPool, asset: Asset) {
  return useCacheCallToWithValue(
    pool.converter,
    pool.converterAbi,
    'reserveWeight',
    '0',
    [getTokenContract(asset).address],
  );
}
