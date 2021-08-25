import { useEffect, useRef, useState } from 'react';
import { useBlockSync } from './useAccount';

const maxRetries = 3;
const refreshInterval = 20 * 1000; // 20 seconds

export const useTradeHistoryRetry = () => {
  const blockSync = useBlockSync();
  const [retryNumber, setRetryNumber] = useState(0);
  const intervalRef = useRef<number>(-1);

  useEffect(() => {
    intervalRef.current = setInterval(
      () => setRetryNumber(prevValue => prevValue + 1),
      refreshInterval,
    );

    return () => {
      if (intervalRef.current >= 0) {
        clearInterval(intervalRef.current);
      }
    };
  }, [blockSync]);

  useEffect(() => {
    if (retryNumber >= maxRetries) {
      if (intervalRef.current >= 0) {
        clearInterval(intervalRef.current);
        intervalRef.current = -1;
      }
      setRetryNumber(0);
    }
  }, [retryNumber]);

  return retryNumber;
};
