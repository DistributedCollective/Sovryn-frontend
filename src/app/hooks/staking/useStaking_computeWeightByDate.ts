import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useStaking_computeWeightByDate(
  lockDate: number,
  currentDate: number,
) {
  return useCacheCallWithValue(
    'staking',
    'computeWeightByDate',
    !!lockDate && !!currentDate,
    Number(lockDate),
    Number(currentDate),
  );
}
