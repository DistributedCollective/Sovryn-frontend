import { createContext } from 'react';
import { RecentTradesDataEntry, TradePriceChange, TradeType } from './types';
import React, { useState, useEffect } from 'react';
import {
  subscription,
  decodeTradeLogs,
} from 'app/pages/PerpetualPage/utils/bscWebsocket';
import { getContract } from 'utils/blockchain/contract-helpers';
import { useGetRecentTrades } from '../../hooks/graphql/useGetRecentTrades';
import { weiTo2 } from 'utils/blockchain/math-helpers';

export const RecentTradesContext = createContext<{
  trades: RecentTradesDataEntry[];
}>({
  trades: [],
});

const recentTradesMaxLength = 50;
const address = getContract('perpetualManager').address.toLowerCase();
const socket = subscription(address, ['Trade'], 14422010);

const initSockets = ({ setValue }, perpetualId) => {
  socketEvents({ setValue }, perpetualId);
};

const socketEvents = ({ setValue }, perpetualId) => {
  socket.on('connected', () => {
    console.log('[recentTradesWs] bsc websocket connected');
  });

  socket.on('data', data => {
    console.log('[recentTradesWs] data received');
    const decoded = decodeTradeLogs(data.data, [data.topics[1]]);
    if (decoded.perpetualId.toLowerCase() === perpetualId.toLowerCase()) {
      const price = parseFloat(weiTo2(decoded.price));
      const parsedTrade: RecentTradesDataEntry = {
        id: data.transactionHash,
        price: parseFloat(weiTo2(decoded.price)),
        size: Math.abs(parseFloat(weiTo2(decoded.tradeAmount))),
        time: new Date(parseInt(decoded.blockTimestamp) * 1e3)
          .toTimeString()
          .slice(0, 8),
        type: decoded.tradeAmount[0] === '-' ? TradeType.SELL : TradeType.BUY,
        priceChange: TradePriceChange.NO_CHANGE,
        fromSocket: true,
      };
      setValue(state => {
        const prevPrice = state.trades[0].price;
        parsedTrade.priceChange =
          prevPrice === price
            ? TradePriceChange.NO_CHANGE
            : prevPrice > price
            ? TradePriceChange.DOWN
            : TradePriceChange.UP;
        return {
          ...state,
          trades: [
            parsedTrade,
            ...state.trades.slice(0, recentTradesMaxLength - 1),
          ],
        };
      });
    }
  });
};

const formatTradeData = (data: any[]): RecentTradesDataEntry[] => {
  const parsedData: RecentTradesDataEntry[] = data.map((trade, index) => {
    const prevTrade = index !== data.length - 1 ? data[index + 1] : data[index];
    return {
      id: trade.transaction.id,
      price: parseFloat(weiTo2(trade.price)),
      priceChange:
        parseFloat(prevTrade.price) === parseFloat(trade.price)
          ? TradePriceChange.NO_CHANGE
          : parseFloat(prevTrade.price) > parseFloat(trade.price)
          ? TradePriceChange.DOWN
          : TradePriceChange.UP,
      size: Math.abs(parseFloat(weiTo2(trade.tradeAmount))),
      time: new Date(parseInt(trade.blockTimestamp) * 1e3)
        .toTimeString()
        .slice(0, 8),
      type: trade.tradeAmount[0] === '-' ? TradeType.SELL : TradeType.BUY,
      fromSocket: false,
    };
  });
  return parsedData;
};

export const RecentTradesContextProvider = props => {
  const [value, setValue] = useState<{ trades: RecentTradesDataEntry[] }>({
    trades: [],
  });
  const { data, error, loading } = useGetRecentTrades(
    props.pair.id,
    recentTradesMaxLength,
  );
  useEffect(() => {
    if (data) {
      const parsedData = formatTradeData(data.trades);
      setValue({ trades: parsedData });
      initSockets({ setValue }, props.pair.id);
    }
    if (error) {
      console.error(error);
    }
  }, [data, error, props.pair.id]);

  return (
    <RecentTradesContext.Provider value={value}>
      {props.children}
    </RecentTradesContext.Provider>
  );
};
