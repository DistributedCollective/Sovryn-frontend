import { useMemo } from 'react';
import { bignumber } from 'mathjs';
import {
  getAmmContract,
  getTokenContractName,
} from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../../../hooks/useCacheCallWithValue';
import { LiquidityPool } from '../../../../utils/models/liquidity-pool';

export function useLiquidityMining_getExpectedV1TokenAmount(
  pool: LiquidityPool,
  amount: string,
) {
  const balance1 = useCacheCallWithValue(
    getTokenContractName(pool.supplyAssets[0].getAsset()),
    'balanceOf',
    '0',
    getAmmContract(pool.poolAsset).address,
  );

  const balance2 = useCacheCallWithValue(
    getTokenContractName(pool.supplyAssets[1].getAsset()),
    'balanceOf',
    '0',
    getAmmContract(pool.poolAsset).address,
  );

  const value = useMemo(() => {
    const rate = bignumber(balance2.value).div(balance1.value).toString();
    return bignumber(amount || '0')
      .mul(rate)
      .toFixed(0);
  }, [balance1.value, balance2.value, amount]);

  return {
    value: value,
    error: balance1.error || balance2.error,
    loading: balance1.loading || balance2.loading,
  };
}
