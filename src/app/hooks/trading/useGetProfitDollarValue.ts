import { bignumber } from 'mathjs';
import { useMemo } from 'react';
import { DEFAULT_ASSET_DECIMALS } from 'utils/classifiers';
import { Asset } from '../../../types/asset';
import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';
import { useCachedAssetPrice } from './useCachedAssetPrice';

export const useGetProfitDollarValue = (
  destinationAsset: Asset,
  amount: string,
): [string, boolean] => {
  const assets = AssetsDictionary.list();

  const assetDetails = assets.filter(
    item => item.asset === destinationAsset,
  )[0];

  const decimals = assetDetails?.decimals || DEFAULT_ASSET_DECIMALS;

  const dollarConversionRate = useCachedAssetPrice(
    destinationAsset,
    Asset.USDT,
  );

  const dollarValue = useMemo(() => {
    if (amount === '0' || amount === '-Infinity') {
      return '0';
    }

    if (destinationAsset === Asset.USDT) {
      return bignumber(amount).toFixed(0);
    }

    return bignumber(amount)
      .mul(dollarConversionRate.value)
      .div(10 ** decimals)
      .toFixed(0);
  }, [amount, destinationAsset, dollarConversionRate.value, decimals]);

  return [dollarValue, dollarConversionRate.loading];
};
