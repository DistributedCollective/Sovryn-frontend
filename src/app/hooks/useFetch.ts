import { useEffect, useState } from 'react';
import axios from 'axios';

interface Response<T> {
  value: T;
  loading: boolean;
  error: any;
}

export function useFetch<T = any>(
  url: string,
  defaultValue: Partial<T> = null as any,
  condition: boolean = undefined as any,
): Response<T> {
  const [state, setState] = useState<Response<T>>({
    value: defaultValue as any,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (condition !== undefined && !condition) return;

    const cancel = axios.CancelToken.source();

    setState(prevState => ({ ...prevState, loading: true }));

    axios
      .get(url, {
        cancelToken: cancel.token,
      })
      .then(response => {
        setState(prevState => ({
          ...prevState,
          loading: false,
          value: response.data,
          error: null,
        }));
      })
      .catch(e => {
        if (!axios.isCancel(e)) {
          setState(prevState => ({
            ...prevState,
            loading: false,
            error: e.message,
          }));
        }
      });

    return () => {
      setState(prevState => ({ ...prevState, loading: false }));
      cancel.cancel();
    };
  }, [url, condition]);

  return state;
}
