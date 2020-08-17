import { drizzleReactHooks } from '@drizzle/react-plugin';

interface CacheCallResponse {
  value: string | null;
  loading: boolean;
  error: string | null;
}

export function useCacheCall(
  contractName: string,
  methodName: string,
  ...args: any
): CacheCallResponse {
  const { drizzle } = drizzleReactHooks.useDrizzle();
  return drizzleReactHooks.useDrizzleState(drizzleState => {
    try {
      const instance = drizzle.contracts[contractName];
      const cacheKey = instance.methods[methodName].cacheCall(...args);
      const cache = drizzleState.contracts[contractName][methodName][cacheKey];
      return {
        value: (cache && cache.value) || null,
        loading: !cache,
        error: (cache && cache.error) || null,
      };
    } catch (e) {
      return {
        value: null,
        loading: false,
        error: e.message,
      };
    }
  }, args);
}
