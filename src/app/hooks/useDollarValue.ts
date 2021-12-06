import { Asset } from 'types';
import { useMemo } from 'react';
import { bignumber } from 'mathjs';
import { useCachedAssetRate } from './trading/useCachedAssetPrice';
import { AssetsDictionary } from '../../utils/dictionaries/assets-dictionary';

// Converts asset amount in wei to RUSDT and returns dollar value in wei back
export function useDollarValue(asset: Asset, weiAmount: string) {
  const dollars = useCachedAssetRate(asset, Asset.USDT);

  const value = useMemo(() => {
    const { decimals } = AssetsDictionary.get(asset);
    if ([Asset.USDT, Asset.DOC, Asset.RDOC].includes(asset)) {
      return weiAmount;
    } else {
      return bignumber(weiAmount)
        .mul(dollars.value.rate)
        .div(dollars.value.precision)
        .mul(10 ** 18)
        .div(10 ** decimals)
        .toFixed(0);
    }
  }, [asset, dollars, weiAmount]);

  return {
    value,
    loading: dollars.loading,
    error: dollars.error,
  };
}
