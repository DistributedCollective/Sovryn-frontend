import { Asset } from '../../types/asset';
import { BigNumber, bignumber } from 'mathjs';

export function useSwapToUsdRate(asset: Asset) {
  return useSwapRate(asset, Asset.DOC);
}

export function useSwapRate(
  srcAsset: Asset,
  dstAsset: Asset,
  srcAmount?: BigNumber,
) {
  // if (srcAsset === dstAsset) {
  //   return bignumber(1);
  // }

  return 1;
}
