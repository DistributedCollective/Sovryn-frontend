import { useCacheCall } from './useCacheCall';
import { useEffect, useState } from 'react';
import { ContractName } from '../../utils/types/contracts';
import { Nullable } from '../../types';

interface Response<T = string> {
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

  const [fixedValue, setFixedValue] = useState(
    value !== null ? value : defaultValue,
  );

  useEffect(() => {
    setFixedValue(value !== null ? value : defaultValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, JSON.stringify(defaultValue)]);

  return { value: fixedValue, loading, error };
}
