import { bignumber } from 'mathjs';
import { useMemo } from 'react';
import { Asset } from 'types';
import { fromWei, toWei } from 'utils/blockchain/math-helpers';
import { useSwapsExternal_getSwapExpectedReturn } from '../swap-network/useSwapsExternal_getSwapExpectedReturn';
import { useDollarValue } from '../useDollarValue';

const oneToken = toWei(1);

export const useGetMaximumAssetPrice = (
  sourceToken: Asset,
  targetToken: Asset,
  slippage: number,
) => {
  const { value, loading, error } = useDollarValue(targetToken, oneToken);
  const slippageMultiplier = useMemo(() => 1 + slippage / 100, [slippage]);

  const { value: rateByPath } = useSwapsExternal_getSwapExpectedReturn(
    sourceToken,
    targetToken,
    oneToken,
  );

  const hasAssetDollarValue = useMemo(() => !loading && !error && !!value, [
    error,
    loading,
    value,
  ]);

  if (!hasAssetDollarValue) {
    return '0';
  }

  return bignumber(rateByPath)
    .mul(fromWei(value))
    .mul(slippageMultiplier)
    .toString();
};
