import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { useAccount } from '../useAccount';
import { ContractName } from '../../../utils/types/contracts';

export function useBalanceOf(tokenContractName: ContractName) {
  return useCacheCallWithValue(
    tokenContractName,
    'balanceOf',
    '0',
    useAccount(),
  );
}
