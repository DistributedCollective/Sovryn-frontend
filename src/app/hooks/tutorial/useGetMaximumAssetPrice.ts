import { bignumber } from 'mathjs';
import { useMemo } from 'react';
import { Asset } from 'types';
import { toWei } from 'utils/blockchain/math-helpers';
import { useDollarValue } from '../useDollarValue';

export const useGetMaximumAssetPrice = (asset: Asset, slippage: number) => {
  const { value, loading, error } = useDollarValue(asset, toWei(1));
  const slippageMultiplier = useMemo(() => 1 + slippage / 100, [slippage]);

  const hasAssetDollarValue = useMemo(() => !loading && !error && !!value, [
    error,
    loading,
    value,
  ]);

  if (!hasAssetDollarValue) {
    return '0';
  }

  return bignumber(value).mul(slippageMultiplier).toString();
};
