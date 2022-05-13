import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { RecentSwapsDataEntry } from 'types/trading-pairs';
import { Asset } from 'types';
import { getTokenContract } from 'utils/blockchain/contract-helpers';

const url = `${backendUrl[currentChainId]}/recentEvents/swap`;

export const useSwap_RecentTrades = (baseToken: Asset, quoteToken: Asset) => {
  const [data, setData] = useState<RecentSwapsDataEntry[] | undefined>(
    undefined,
  );
  const baseTokenAddress = getTokenContract(baseToken).address;
  const quoteTokenAddress = getTokenContract(quoteToken).address;

  useEffect(() => {
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
      });
  }, [baseTokenAddress, quoteTokenAddress]);

  return data;
};
