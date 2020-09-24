import { useAccount } from './useAccount';
import { useDrizzleState } from './useDrizzleState';
import { Sovryn } from '../../utils/sovryn';

export function useBalance() {
  const account = useAccount();

  console.log(account);

  console.log(Sovryn.getWriteWeb3());

  const balance = useDrizzleState(state => state.accountBalances[account]);
  return {
    value: balance || '0',
    loading: balance === undefined,
    error: null,
  };
}
