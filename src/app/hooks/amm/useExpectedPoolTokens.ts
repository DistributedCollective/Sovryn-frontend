import { Asset } from 'types/asset';
import { useReserveStakedBalance } from './useReserveStakedBalance';
import { bignumber } from 'mathjs';
import { useTokenSupply } from './useTokenSupply';

export function useExpectedPoolTokens(asset: Asset, amount: string) {
  const {
    value: stakedBalance,
    loading: loadingStaked,
  } = useReserveStakedBalance(asset);
  const { value: poolTokenSupply, loading: loadingPool } = useTokenSupply(
    asset,
  );
  return {
    value:
      stakedBalance === '0' || poolTokenSupply === '0'
        ? '0'
        : bignumber(amount).mul(poolTokenSupply).div(stakedBalance).toFixed(0),
    loading: loadingPool || loadingStaked,
    error: null,
  };
}
