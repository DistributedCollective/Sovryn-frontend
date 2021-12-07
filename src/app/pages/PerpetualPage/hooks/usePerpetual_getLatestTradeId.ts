import { useCallback, useContext, useState, useEffect } from 'react';
import { Nullable } from 'types';
import { RecentTradesContext } from '../components/RecentTradesTable/context';
import throttle from 'lodash.throttle';

const BSC_AVERAGE_BLOCK_TIME = 3500; // 3.5s

export const usePerpetual_getLatestTradeId = () => {
  const [latestTradeId, setLatestTradeId] = useState<Nullable<string>>();
  const { trades } = useContext(RecentTradesContext);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledSetLatestTradeId = useCallback(
    throttle(value => setLatestTradeId(value), BSC_AVERAGE_BLOCK_TIME),
    [],
  );

  useEffect(() => throttledSetLatestTradeId(trades[0]?.id), [
    throttledSetLatestTradeId,
    trades,
  ]);

  return latestTradeId;
};
