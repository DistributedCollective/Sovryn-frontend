import { useBetterCacheCall } from './useBetterCacheCall';
import { useEffect, useState } from 'react';

export function useCacheCallWithValue(
  contractName: string,
  methodName: string,
  defaultValue: string = '0',
  ...args: any
) {
  const { value, loading, error } = useBetterCacheCall(
    contractName,
    methodName,
    ...args,
  );

  const [fixedValue, setFixedValue] = useState(
    value !== null ? value : defaultValue,
  );

  useEffect(() => {
    setFixedValue(value !== null ? value : defaultValue);
  }, [defaultValue, value]);

  return { value: fixedValue, loading, error };
}
