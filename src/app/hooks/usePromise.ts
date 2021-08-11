import { useEffect, useMemo, useState } from 'react';

type UsePromiseCallback<T> = () => Promise<T>;

interface UsePromiseResult<T> {
  result?: T;
  error?: Error;
}

export const usePromise = <T>(
  callback: UsePromiseCallback<T>,
  dependencies: any[],
): UsePromiseResult<T> => {
  // useMemo should not require callback as a dependency, otherwise it would be called every time.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const promise = useMemo(callback, dependencies);

  const [result, setResult] = useState<UsePromiseResult<T>>({});

  useEffect(() => {
    if (promise) {
      let status = { isCanceled: false };

      promise
        .then(result => {
          if (!status.isCanceled) {
            setResult({ result });
          }
        })
        .catch(error => {
          if (!status.isCanceled) {
            setResult({ error });
          }
        });

      return () => {
        status.isCanceled = true;
      };
    }
  }, [promise]);

  return result;
};
