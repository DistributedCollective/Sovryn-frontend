import { useAccount } from './useAccount';
import { useDrizzleState } from './useDrizzleState';

export function useBalance() {
  const account = useAccount();

  const balance = useDrizzleState(state => state.accountBalances[account]);
  return {
    value: balance || '0',
    loading: balance === undefined,
    error: null,
  };
}
