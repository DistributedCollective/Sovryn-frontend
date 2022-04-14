import { useCacheCallWithValue } from '../useCacheCallWithValue';

export const useStaking_timestampToLockDate = (timestamp: number) =>
  useCacheCallWithValue(
    'staking',
    'timestampToLockDate',
    '0',
    Number(timestamp),
  );
