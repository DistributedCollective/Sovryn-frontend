import {
  RecentTradesDataEntry,
  TradePriceChange,
  TradeType,
} from '../components/RecentTradesTable/types';

import { useBlockSync } from 'app/hooks/useAccount';
import { useEffect, useState } from 'react';

const placeholderItems = 49;
const initialPrice = 36340;
const initialSize = 30;
const initialMinutes = 10;

const getPriceChange = () => {
  const randomNumber = Math.floor(Math.random() * 3);

  switch (randomNumber) {
    case 0:
      return TradePriceChange.DOWN;
    case 1:
      return TradePriceChange.UP;
    default:
      return TradePriceChange.NO_CHANGE;
  }
};

const generatePlaceholderData = async (): Promise<RecentTradesDataEntry[]> => {
  const result: RecentTradesDataEntry[] = [];

  for (let i = 0; i < placeholderItems; i++) {
    const randomNumber = Math.random();

    result.push({
      id: i.toString(),
      type: randomNumber < 0.5 ? TradeType.SELL : TradeType.BUY,
      price: initialPrice + i,
      priceChange: getPriceChange(),
      size: initialSize + i,
      time: `15:${initialMinutes + i}:00`,
    });
  }

  return new Promise(resolve => resolve(result));
};

export const useMargin_RecentTradesTable = () => {
  const blockId = useBlockSync();
  const [data, setData] = useState<RecentTradesDataEntry[] | null>();

  // TODO: This is just a placeholder, implement a real fetching of recent trades
  useEffect(() => {
    generatePlaceholderData().then(data => {
      data ? setData(data) : setData(null);
    });
  }, [blockId]);

  return data;
};
