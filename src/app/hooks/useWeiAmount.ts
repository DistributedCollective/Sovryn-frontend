import { assetToWei } from 'utils/blockchain/math-helpers';
import { Asset } from 'types';

// Using SOV as default as it's 18 decimals
export function useWeiAmount(amount: any, asset: Asset = Asset.SOV) {
  return assetToWei(amount, asset);
}
