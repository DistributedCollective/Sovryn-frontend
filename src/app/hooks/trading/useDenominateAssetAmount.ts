import { useMemo } from 'react';
import { bignumber } from 'mathjs';
import { Asset } from 'types';
import { useCachedAssetRate } from './useCachedAssetPrice';
import { fixNumber } from 'utils/helpers';

export const useDenominateAssetAmount = (
  sourceAsset: Asset,
  targetAsset: Asset,
  sourceWeiAmount: string,
) => {
  const cached = useCachedAssetRate(sourceAsset, targetAsset);
  const value = useMemo(
    () =>
      fixNumber(
        bignumber(sourceWeiAmount || '0')
          .mul(
            bignumber(cached.value.rate || '0').div(
              cached.value.precision || '0',
            ),
          )
          .toString(),
      ).toString(),
    [cached.value.precision, cached.value.rate, sourceWeiAmount],
  );
  return {
    value,
    loading: cached.loading,
    error: cached.error,
  };
};
