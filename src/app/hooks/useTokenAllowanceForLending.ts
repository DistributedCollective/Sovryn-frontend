import { Asset } from '../../types/asset';
import { getTokenContractName } from '../../utils/blockchain/contract-helpers';
import { useAccount } from './useAccount';
import { useCacheCallWithValue } from './useCacheCallWithValue';
import { ContractName } from '../../utils/types/contracts';

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

export function useAllowance(
  contractName: ContractName,
  spenderAddress: string,
) {
  const owner = useAccount();
  return useCacheCallWithValue(
    contractName,
    'allowance',
    '0',
    /* owner */ owner,
    spenderAddress,
  );
}
