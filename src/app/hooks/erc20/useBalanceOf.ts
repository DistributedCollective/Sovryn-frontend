import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { useAccount } from '../useAccount';

export function useBalanceOf(tokenContractName: string) {
  return useCacheCallWithValue(
    tokenContractName,
    'balanceOf',
    '0',
    useAccount(),
  );
}
