import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { RecentTradesDataEntry } from 'types/trading-pairs';
import { Asset } from 'types';
import { getTokenContract } from 'utils/blockchain/contract-helpers';

const url = `${backendUrl[currentChainId]}/recentEvents/trade`;

export const useMargin_RecentTrades = (baseToken: Asset, quoteToken: Asset) => {
  const [data, setData] = useState<RecentTradesDataEntry[] | undefined>(
    undefined,
  );
  const baseTokenAddress = getTokenContract(baseToken).address;
  const quoteTokenAddress = getTokenContract(quoteToken).address;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(url, {
        params: {
          baseToken: baseTokenAddress,
          quoteToken: quoteTokenAddress,
          length: 100,
        },
      })
      .then(res => {
        setData(res.data);
      })
      .finally(() => setLoading(false));
  }, [baseTokenAddress, quoteTokenAddress]);

  return { data, loading };
};
