import { useDrizzleState } from './useDrizzleState';

export function useAccount() {
  return useDrizzleState(drizzleState => {
    return drizzleState.accounts ? drizzleState.accounts[0] : null;
  });
}

export function useIsConnected() {
  const account = useAccount();
  return !!account;
}
