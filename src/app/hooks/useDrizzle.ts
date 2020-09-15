import { drizzleReactHooks } from '@drizzle/react-plugin';

export function useDrizzle() {
  const { drizzle } = drizzleReactHooks.useDrizzle();
  return drizzle;
}
