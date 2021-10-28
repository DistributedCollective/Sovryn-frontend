import { Asset } from 'types';
import { useMemo } from 'react';
import { bignumber } from 'mathjs';
import { useCachedAssetPrice } from './trading/useCachedAssetPrice';
import { AssetsDictionary } from '../../utils/dictionaries/assets-dictionary';

// Converts MYNT amount in wei to RUSDT and returns dollar value in wei back
export const useDollarValueMynt = (weiAmount: string) => {
  const asset = Asset.SOV;
  const dollars = useCachedAssetPrice(asset, Asset.USDT);

  const value = useMemo(() => {
    const { decimals } = AssetsDictionary.get(asset);
    return bignumber(weiAmount)
      .mul(dollars.value)
      .div(10 ** (decimals + 2))
      .toFixed(0);
  }, [asset, dollars, weiAmount]);

  return {
    value,
    loading: dollars.loading,
    error: dollars.error,
  };
};
