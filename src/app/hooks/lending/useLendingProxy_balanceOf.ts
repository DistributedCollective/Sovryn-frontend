import { Asset } from 'types/asset';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useLendingProxy_balanceOf(asset: Asset, walletAddress: string) {
  return useCacheCallWithValue('priceFeed', 'userLPBalance', '0', [
    walletAddress,
    getLendingContractName(asset),
  ]);
}
