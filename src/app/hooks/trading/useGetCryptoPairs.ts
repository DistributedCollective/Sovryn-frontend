import axios from 'axios';
import { useState, useEffect } from 'react';
import { IPairsData } from 'types/trading-pairs';
import { backendUrl, currentChainId, graphWrapperUrl } from 'utils/classifiers';

const defaultPairsData = {
  pairs: [],
  total_volume_btc: 0,
  total_volume_usd: 0,
  updated_at: '',
};

export const useGetCryptoPairs = (): IPairsData => {
  const [pairsData, setPairsData] = useState<IPairsData>(defaultPairsData);
  const url = backendUrl[currentChainId];

  useEffect(() => {
    axios
      .get(graphWrapperUrl[currentChainId] + 'cmc/summary?extra=true', {
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
