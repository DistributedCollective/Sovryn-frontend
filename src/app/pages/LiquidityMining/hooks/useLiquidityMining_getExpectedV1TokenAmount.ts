import { useMemo } from 'react';
import { bignumber } from 'mathjs';
import type { AbiItem } from 'web3-utils';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
import erc20Abi from 'utils/blockchain/abi/erc20.json';
import type { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';
import { useCacheCallToWithValue } from 'app/hooks/chain/useCacheCallToWithValue';

export function useLiquidityMining_getExpectedV1TokenAmount(
  pool: AmmLiquidityPool,
  amount: string,
) {
  const balance1 = useCacheCallToWithValue(
    getTokenContract(pool.assetA).address,
    erc20Abi as AbiItem[],
    'balanceOf',
    '0',
    [pool.converter],
  );

  const balance2 = useCacheCallToWithValue(
    getTokenContract(pool.assetB).address,
    erc20Abi as AbiItem[],
    'balanceOf',
    '0',
    [pool.converter],
  );

  const value = useMemo(() => {
    const rate = bignumber(balance2.value).div(balance1.value).toString();
    return bignumber(amount || '0')
      .mul(rate)
      .toFixed(0);
  }, [balance1, balance2, amount]);

  return {
    value: value,
    error: balance1.error || balance2.error,
    loading: balance1.loading || balance2.loading,
  };
}
