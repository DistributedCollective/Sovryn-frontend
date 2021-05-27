import { useMemo } from 'react';
import { bignumber } from 'mathjs';
import {
  getAmmContract,
  getPoolTokenContractName,
  getTokenContractName,
} from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../../../hooks/useCacheCallWithValue';
import { LiquidityPool } from '../../../../utils/models/liquidity-pool';

export function useLiquidityMining_getExpectedV1PoolTokens(
  pool: LiquidityPool,
  amount: string,
) {
  const poolTokenSupply = useCacheCallWithValue(
    getPoolTokenContractName(pool.poolAsset, pool.poolAsset),
    'totalSupply',
    '0',
  );

  const tokenBalanceOnConverter = useCacheCallWithValue(
    getTokenContractName(pool.poolAsset),
    'balanceOf',
    '0',
    getAmmContract(pool.poolAsset).address,
  );

  const value = useMemo(
    () =>
      bignumber(amount || '0')
        .div(tokenBalanceOnConverter.value)
        .mul(poolTokenSupply.value)
        .toFixed(0),
    [amount, tokenBalanceOnConverter.value, poolTokenSupply.value],
  );

  return {
    value: value,
    error: tokenBalanceOnConverter.error || poolTokenSupply.error,
    loading: tokenBalanceOnConverter.loading || poolTokenSupply.loading,
  };
}
