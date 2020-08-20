import { Asset } from 'types/asset';
import { toWei } from 'web3-utils';

/**
 * @todo Make sure asset price is retrieved from oracle contract when it's ready.
 * @param asset
 */
export function useBorrowAssetPrice(asset: Asset) {
  // hard-coding price to 1000$ because we dont have oracle contract yet.
  return {
    value: toWei('1000', 'ether'),
    loading: false,
  };
}
