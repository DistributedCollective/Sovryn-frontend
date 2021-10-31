import { Asset } from 'types';
import { useMemo } from 'react';
import { bignumber } from 'mathjs';
import { useCachedAssetPrice } from './trading/useCachedAssetPrice';
import { AssetsDictionary } from '../../utils/dictionaries/assets-dictionary';
import { useEstimateMyntToSov } from './useEstimateMyntToSov';

export const useDollarValueMynt = (weiAmount: string) => {
  const asset = Asset.SOV;
  const sovDollars = useCachedAssetPrice(asset, Asset.USDT);
  const sovWeiAmount = useEstimateMyntToSov(weiAmount);

  const value = useMemo(() => {
    const { decimals } = AssetsDictionary.get(asset);
    return bignumber(sovWeiAmount)
      .mul(sovDollars.value)
      .div(10 ** decimals)

      .toFixed(0);
  }, [asset, sovDollars, weiAmount]);

  return {
    value,
    loading: sovDollars.loading,
    error: sovDollars.error,
  };
};
