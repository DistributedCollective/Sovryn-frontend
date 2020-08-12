import { useCacheCall } from './useCacheCall';
import { Asset } from '../types/asset';
import {
  getLendingContract,
  getTokenContract,
} from '../utils/blockchain/assetMapper';
import { useAccount } from './useAccount';

export function useTokenAllowanceForLending(asset: Asset): number {
  const owner = useAccount();
  return useCacheCall(
    getTokenContract(asset).contractName,
    'allowance',
    /* owner */ owner,
    /* spender */ getLendingContract(asset).address,
  );
}
