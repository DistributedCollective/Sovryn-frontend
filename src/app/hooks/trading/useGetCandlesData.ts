import axios from 'axios';
import { useEffect, useState } from 'react';
import { backendUrl, currentChainId } from 'utils/classifiers';

interface ICandlesProps {
  close: number;
  high: number;
  low: number;
  open: number;
  time: number;
}

export const useGetCandlesData = (symbolA: string, symbolB: string) => {
  const [candles, setCandles] = useState<ICandlesProps[]>();
  const url = backendUrl[currentChainId];
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const dayBefore = new Date(new Date().setDate(new Date().getDate() - 1));
    const currentTime = new Date().getTime();
    axios
      .get(url + `/datafeed/price/${symbolA}:${symbolB}`, {
        params: {
          startTime: `${dayBefore.getTime()}`,
          endTime: `${currentTime}`,
        },
      })
      .then(({ data }) => setCandles(data.series))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [url, symbolA, symbolB]);

  return { candles, loading };
};
