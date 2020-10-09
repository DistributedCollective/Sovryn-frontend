import { Asset } from 'types/asset';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useLending_balanceOf(asset: Asset, walletAddress: string) {
  return useCacheCallWithValue(
    getLendingContractName(asset),
    'balanceOf',
    '0',
    walletAddress,
  );
}
