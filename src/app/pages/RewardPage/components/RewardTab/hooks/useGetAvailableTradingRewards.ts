import { useAccount } from 'app/hooks/useAccount';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { backendUrl, currentChainId } from 'utils/classifiers';

export const useGetAvailableTradingRewards = (): string => {
  const url = backendUrl[currentChainId];
  const [tradeRewards, setTradeRewards] = useState('0');
  const address = useAccount();

  useEffect(() => {
    axios
      .get(`${url}/v1/event-history/availableTradingRewards/${address}`)
      .then(res => {
        const { events } = res.data;
        setTradeRewards(events[0].sum);
      })
      .catch(error => console.log(error));
  }, [url, address]);

  return tradeRewards;
};
