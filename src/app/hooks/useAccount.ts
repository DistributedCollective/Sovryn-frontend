import { useDrizzleState } from './useDrizzleState';

export function useAccount() {
  return useDrizzleState(drizzleState => {
    return drizzleState.accounts ? drizzleState.accounts[0] : null;
  });
}

export function useIsConnected() {
  return useDrizzleState(drizzleState => {
    if (
      drizzleState.web3?.networkId !== Number(process.env.REACT_APP_NETWORK_ID)
    )
      return false;
    return !!drizzleState.accounts[0];
  });
}

export function useIsCorrectNetwork() {
  return useDrizzleState(drizzleState => {
    return (
      drizzleState.web3?.networkId === Number(process.env.REACT_APP_NETWORK_ID)
    );
  });
}
