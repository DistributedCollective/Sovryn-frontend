import { useCacheCall } from './useCacheCall';
import { Asset } from '../types/asset';
import {
  getLendingContract,
  getTokenContractName,
} from '../utils/blockchain/contract-helpers';
import { useAccount } from './useAccount';

export function useTokenAllowanceForLending(asset: Asset): number {
  const owner = useAccount();
  return useCacheCall(
    getTokenContractName(asset),
    'allowance',
    /* owner */ owner,
    /* spender */ getLendingContract(asset).address,
  );
}
