import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useGetLimitOrders(account: string) {
  console.log('account: ', account);
  return useCacheCallWithValue<Array<String>>(
    'orderBook',
    'hashesOfMaker',
    [],
    account,
    1,
    5,
  );
}
