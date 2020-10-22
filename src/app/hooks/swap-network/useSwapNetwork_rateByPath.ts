import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useSwapNetwork_rateByPath(
  callData: Array<string>,
  amount: string,
) {
  return useCacheCallWithValue(
    'swapNetwork',
    'rateByPath',
    '0',
    callData,
    amount,
  );
}
