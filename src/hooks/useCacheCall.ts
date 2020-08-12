import { drizzleReactHooks } from '@drizzle/react-plugin';
import { ContractName } from 'utils/blockchain/contracts';

export function useCacheCall(
  contractNameOrNames: ContractName,
  methodNameOrFunction: string,
  ...args: any
) {
  const { useCacheCall } = drizzleReactHooks.useDrizzle();
  return useCacheCall(contractNameOrNames, methodNameOrFunction, ...args);
}
