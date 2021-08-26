import { useCacheCall } from './useCacheCall';
import { useMemo } from 'react';
import { ContractName } from '../../utils/types/contracts';
import { Nullable } from '../../types';

export interface Response<T = string> {
  value: T;
  loading: boolean;
  error: Nullable<string>;
}

export function useCacheCallWithValue<T = string>(
  contractName: ContractName,
  methodName: string,
  defaultValue: T | string | any = '0',
  ...args: any
): Response<T> {
  const { value, loading, error } = useCacheCall<T>(
    contractName,
    methodName,
    ...args,
  );

  const fixedValue = useMemo(() => (value !== null ? value : defaultValue), [
    value,
    defaultValue,
  ]);

  return { value: fixedValue, loading, error };
}
