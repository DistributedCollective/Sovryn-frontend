import { useContext, useState } from 'react';
import { Nullable } from 'types';
import { RecentTradesContext } from '../components/RecentTradesTable/context';
import { useDebouncedEffect } from '../../../hooks/useDebouncedEffect';

const BSC_AVERAGE_BLOCK_TIME = 3500; // 3.5s

export const usePerpetual_getLatestTradeId = () => {
  const [latestTradeId, setLatestTradeId] = useState<Nullable<string>>();
  const { trades } = useContext(RecentTradesContext);

  useDebouncedEffect(
    () => setLatestTradeId(trades[0]?.id),
    [trades],
    BSC_AVERAGE_BLOCK_TIME,
  );

  return latestTradeId;
};
