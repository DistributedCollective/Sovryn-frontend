import { useMemo } from 'react';
import { bignumber } from 'mathjs';
import type { AbiItem } from 'web3-utils';
import type { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';
import { useCacheCallToWithValue } from 'app/hooks/chain/useCacheCallToWithValue';
import {
  getContract,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';

export function useLiquidityMining_getExpectedV1PoolTokens(
  pool: AmmLiquidityPool,
  amount: string,
) {
  const erc20Abi = getContract('SOV_token').abi;

  const poolTokenSupply = useCacheCallToWithValue(
    pool.poolTokenA,
    erc20Abi as AbiItem[],
    'totalSupply',
    '0',
    [],
  );

  const tokenBalanceOnConverter = useCacheCallToWithValue(
    getTokenContract(pool.assetA).address,
    erc20Abi as AbiItem[],
    'balanceOf',
    '0',
    [pool.converter.toLocaleLowerCase()],
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
