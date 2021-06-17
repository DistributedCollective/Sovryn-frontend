import { useEffect, useState } from 'react';
import { useBlockSync } from './useAccount';

const maxRetries = 3;
const refreshInterval = 20 * 1000; // 20 seconds

export const useTradeHistoryRetry = () => {
  const blockSync = useBlockSync();
  const [retryNumber, setRetryNumber] = useState(0);
  const [intervalId, setIntervalId] = useState(0);

  useEffect(() => {
    if (intervalId === 0) {
      setIntervalId(
        setInterval(
          () => setRetryNumber(prevValue => prevValue + 1),
          refreshInterval,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockSync]);

  useEffect(() => {
    if (retryNumber === maxRetries) {
      clearInterval(intervalId);
      setIntervalId(0);
      setRetryNumber(0);
    }
  }, [intervalId, retryNumber]);

  return retryNumber;
};
