import { drizzleReactHooks } from '@drizzle/react-plugin';

export function useCacheCall(
  contractNameOrNames: string | string[],
  methodNameOrFunction: string,
  ...args: any
) {
  const { useCacheCall } = drizzleReactHooks.useDrizzle();
  return useCacheCall(contractNameOrNames, methodNameOrFunction, ...args);
}
