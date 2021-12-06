import { useContext } from 'react';
import { RecentTradesContext } from '../components/RecentTradesTable/context';

export const usePerpetual_getLatestTradeId = () => {
  const { trades } = useContext(RecentTradesContext);

  return trades[0]?.id;
};
