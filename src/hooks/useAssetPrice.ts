import { Asset } from '../types/asset';
import {
  getLendingContract,
  getTokenContractName,
} from 'utils/blockchain/contract-helpers';
import { useAccount } from './useAccount';
import { useCacheCallWithValue } from './useCacheCallWithValue';

export function useAssetPrice(asset: Asset): number {
  const owner = useAccount();
  const { value } = useCacheCallWithValue(
    getTokenContractName(asset),
    'allowance',
    '0',
    /* owner */ owner,
    /* spender */ getLendingContract(asset).address,
  );
  return Number(value);
}
