import { drizzleReactHooks } from '@drizzle/react-plugin';

/**
 * @deprecated use useCacheCallWithValue instead.
 * @param contractNameOrNames
 * @param methodNameOrFunction
 * @param args
 */
export function useCacheCall(
  contractNameOrNames: string | string[],
  methodNameOrFunction: string,
  ...args: any
) {
  const { useCacheCall } = drizzleReactHooks.useDrizzle();
  return useCacheCall(contractNameOrNames, methodNameOrFunction, ...args);
}
