import axios from 'axios';
import { useState, useEffect } from 'react';
import { IPairsData } from 'types/trading-pairs';
import { backendUrl, currentChainId } from 'utils/classifiers';

export const useGetCryptoPairs = (): IPairsData => {
  const [pairsData, setPairsData] = useState<IPairsData>() as any;
  const url = backendUrl[currentChainId];

  useEffect(() => {
    axios
      .get(url + '/api/v1/trading-pairs/summary/', {
        params: {
          extra: true,
        },
      })
      .then(res => {
        setPairsData(res.data);
      })
      .catch(e => console.error(e));
  }, [url]);

  return pairsData;
};
