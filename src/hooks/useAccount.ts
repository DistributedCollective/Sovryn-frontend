import { drizzleReactHooks } from '@drizzle/react-plugin';

export function useAccount() {
  return drizzleReactHooks.useDrizzleState(drizzleState => {
    return drizzleState.accounts ? drizzleState.accounts[0] : null;
  });
}
