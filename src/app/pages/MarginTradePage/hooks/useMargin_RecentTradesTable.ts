import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { RecentTradesDataEntry } from '../types';
import { TradingPair } from 'utils/models/trading-pair';

export const useMargin_RecentTradesTable = (pair: TradingPair) => {
  const url = `${backendUrl[currentChainId]}/recentEvents/trade`;
  const [data, setData] = useState<RecentTradesDataEntry[] | null>();
  const baseToken = pair.shortDetails.tokenContract.address;
  const quoteToken = pair.longDetails.tokenContract.address;

  useEffect(() => {
    axios
      .get(url, {
        params: {
          baseToken: baseToken,
          quoteToken: quoteToken,
          length: 100,
        },
      })
      .then(res => {
        setData(res.data);
      })
      .catch(e => {
        console.log(e);
      });
  }, [url, baseToken, quoteToken]);

  return data;
};
