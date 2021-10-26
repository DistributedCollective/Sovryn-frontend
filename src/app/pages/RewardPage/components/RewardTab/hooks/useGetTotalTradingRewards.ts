import { useAccount } from 'app/hooks/useAccount';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { backendUrl, currentChainId } from 'utils/classifiers';

export const useGetTotalTradingRewards = (): string => {
  const url = backendUrl[currentChainId];
  const [totalTradingRewards, setTotalTradingRewards] = useState('0');
  const address = useAccount();

  useEffect(() => {
    axios
      .get(`${url}/v1/event-history/availableRewardSov/${address}`)
      .then(res => {
        const { events } = res.data;
        setTotalTradingRewards(events[0].sum);
      })
      .catch(error => console.log(error));
  }, [url, address]);

  return totalTradingRewards;
};
