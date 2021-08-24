import { useRef, useEffect } from 'react';

export function useInterval(
  callback: () => void,
  delay: number | null,
  options?: { immediate: boolean },
) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      return;
    }

    if (options?.immediate) {
      savedCallback.current();
    }

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay, options?.immediate]);
}
