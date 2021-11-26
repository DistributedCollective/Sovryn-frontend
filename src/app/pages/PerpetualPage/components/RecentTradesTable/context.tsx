import { createContext } from 'react';
import {
  TradeEvent,
  RecentTradesDataEntry,
  TradePriceChange,
  TradeType,
} from './types';
import React, { useState, useEffect, useContext } from 'react';
import {
  subscription,
  decodeTradeLogs,
} from 'app/pages/PerpetualPage/utils/bscWebsocket';
import { getContract } from 'utils/blockchain/contract-helpers';
import { useGetRecentTrades } from '../../hooks/graphql/useGetRecentTrades';
import { weiTo2 } from 'utils/blockchain/math-helpers';

export const SocketContext = createContext<{
  trades: RecentTradesDataEntry[];
}>({
  trades: [],
});

const address = getContract('perpetualManager').address.toLowerCase();
const socket = subscription(address, ['Trade'], 14422010);

const initSockets = ({ setValue }) => {
  socketEvents({ setValue });
};

const socketEvents = ({ setValue }) => {
  socket.on('connected', () => {
    console.log('[socketProvider] bsc websocket connected');
  });

  socket.on('data', data => {
    console.log('[socketProvider] data received');
    const decoded = decodeTradeLogs(data.data, [data.topics[1]]);
    const { trades: prevTrades } = useContext(SocketContext);
    const prevPrice = prevTrades[0].price;
    const price = parseFloat(weiTo2(decoded.price));
    /** TODO: Check if the perpetual id is the right one for this page */
    const parsedTrade: RecentTradesDataEntry = {
      id: data.transactionHash,
      price: parseFloat(weiTo2(decoded.price)),
      size: Math.abs(parseFloat(weiTo2(decoded.tradeAmount))),
      time: new Date(parseInt(decoded.blockTimestamp) * 1e3)
        .toTimeString()
        .slice(0, 8),
      type: decoded.tradeAmount[0] === '-' ? TradeType.SELL : TradeType.BUY,
      priceChange:
        prevPrice === price
          ? TradePriceChange.NO_CHANGE
          : prevPrice > price
          ? TradePriceChange.UP
          : TradePriceChange.DOWN,
    };
    console.log('[socketProvider] parsed trade', parsedTrade);
    setValue(state => {
      return { ...state, trades: [parsedTrade, ...state.trades] };
    });
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
          ? TradePriceChange.UP
          : TradePriceChange.DOWN,
      size: Math.abs(parseFloat(weiTo2(trade.tradeAmount))),
      time: new Date(parseInt(trade.blockTimestamp) * 1e3)
        .toTimeString()
        .slice(0, 8),
      type: trade.tradeAmount[0] === '-' ? TradeType.SELL : TradeType.BUY,
    };
  });
  return parsedData;
};

export const SocketProvider = props => {
  const [value, setValue] = useState<{ trades: RecentTradesDataEntry[] }>({
    trades: [],
  });
  console.debug('[socketProvider] graphql call', props);
  const { data, error, loading } = useGetRecentTrades(props.pair.id, 50);
  useEffect(() => {
    if (data) {
      console.debug('[socketProvider] data received', data);
      const parsedData = formatTradeData(data.trades);
      setValue({ trades: parsedData });
      initSockets({ setValue });
    }
    if (error) {
      console.error(error);
    }
  }, [data, error]);

  return (
    <SocketContext.Provider value={value}>
      {props.children}
    </SocketContext.Provider>
  );
};
