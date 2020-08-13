import { useCacheCall } from './useCacheCall';
import { Asset } from '../types/asset';
import {
  getLendingContract,
  getTokenContractName,
} from '../utils/blockchain/contract-helpers';
import { useAccount } from './useAccount';
import { useCacheCallWithValue } from './useCacheCallWithValue';

export function useTokenAllowanceForLending(asset: Asset): number {
  const owner = useAccount();
  return useCacheCall(
    getTokenContractName(asset),
    'allowance',
    /* owner */ owner,
    /* spender */ getLendingContract(asset).address,
  );
}

export function useTokenAllowance(tokenAsset: Asset, spenderAddress: string) {
  const owner = useAccount();
  return useCacheCallWithValue(
    getTokenContractName(tokenAsset),
    'allowance',
    '0',
    /* owner */ owner,
    spenderAddress,
  );
}
