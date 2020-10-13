import { Asset } from 'types/asset';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useLending_assetBalanceOf(asset: Asset, walletAddress: string) {
  return useCacheCallWithValue(
    getLendingContractName(asset),
    'assetBalanceOf',
    '0',
    walletAddress,
  );
}
