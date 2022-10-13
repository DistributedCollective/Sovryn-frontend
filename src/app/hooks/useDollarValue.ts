import { Asset } from 'types';
import { useMemo } from 'react';
import { bignumber } from 'mathjs';
import { useCachedAssetPrice } from './trading/useCachedAssetPrice';
import { AssetsDictionary } from '../../utils/dictionaries/assets-dictionary';
import { DEFAULT_ASSET_DECIMALS } from 'utils/classifiers';

// Converts asset amount in wei to RUSDT and returns dollar value in wei back
export function useDollarValue(asset: Asset, weiAmount: string) {
  if (asset === Asset.ZUSD) asset = Asset.XUSD;
  const dollars = useCachedAssetPrice(asset, Asset.USDT);

  const value = useMemo(() => {
    const assetDetails = AssetsDictionary.get(asset);
    const decimals = assetDetails?.decimals || DEFAULT_ASSET_DECIMALS;

    if ([Asset.USDT, Asset.DOC, Asset.RDOC].includes(asset)) {
      return weiAmount;
    } else {
      return bignumber(weiAmount)
        .mul(dollars.value)
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
