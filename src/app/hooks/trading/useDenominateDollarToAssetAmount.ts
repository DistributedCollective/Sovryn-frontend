import { Asset } from 'types';
import { toWei } from 'utils/blockchain/math-helpers';
import { useDenominateAssetAmount } from './useDenominateAssetAmount';

export const FIFTY_DOLLARS = toWei(50);

export const useDenominateDollarToAssetAmount = (
  asset: Asset,
  xusdAmountInWei: string = FIFTY_DOLLARS,
) => {
  return useDenominateAssetAmount(Asset.XUSD, asset, xusdAmountInWei);
};
