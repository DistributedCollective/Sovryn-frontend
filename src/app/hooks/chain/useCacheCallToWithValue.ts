import { useMemo } from 'react';
import { AbiItem } from 'web3-utils';
import { useCacheCallTo } from './useCacheCallTo';
import { CacheCallWithValueResponse } from '../useCacheCallWithValue';

export function useCacheCallToWithValue<T = string>(
  to: string,
  abi: AbiItem | AbiItem[],
  methodName: string,
  defaultValue: T | string | any = '0',
  args: any[],
): CacheCallWithValueResponse<T> {
  const { value, loading, error } = useCacheCallTo<T>(
    to,
    abi,
    methodName,
    args,
  );

  const fixedValue = useMemo(() => (value !== null ? value : defaultValue), [
    value,
    defaultValue,
  ]);

  return { value: fixedValue, loading, error };
}
