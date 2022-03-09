import { useMemo } from 'react';
import { bignumber } from 'mathjs';
import { Asset } from 'types';
import { toWei } from 'utils/blockchain/math-helpers';
import { useCachedAssetRate } from './useCachedAssetPrice';
import { fixNumber } from 'utils/helpers';

export const FIFTY_DOLLARS = toWei(50);

export const useDenominateDollarToAssetAmount = (
  asset: Asset,
  xusdAmountInWei: string = FIFTY_DOLLARS,
) => {
  const cached = useCachedAssetRate(Asset.XUSD, asset);
  const value = useMemo(
    () =>
      fixNumber(
        bignumber(xusdAmountInWei || '0')
          .mul(
            bignumber(cached.value.rate || '0').div(
              cached.value.precision || '0',
            ),
          )
          .toString(),
      ).toString(),
    [cached.value.precision, cached.value.rate, xusdAmountInWei],
  );
  return {
    value,
    loading: cached.loading,
    error: cached.error,
  };
};
