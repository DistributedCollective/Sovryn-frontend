import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useRemoveLiquidityReturnAndFee(
  poolToken: string,
  amount: string,
) {
  return useCacheCallWithValue(
    'liquidityProtocol',
    'removeLiquidityReturnAndFee',
    ['0', '0'],
    poolToken,
    amount,
  );
}
