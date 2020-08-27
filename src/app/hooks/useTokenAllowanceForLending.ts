import { Asset } from '../../types/asset';
import { getTokenContractName } from '../../utils/blockchain/contract-helpers';
import { useAccount } from './useAccount';
import { useCacheCallWithValue } from './useCacheCallWithValue';

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
