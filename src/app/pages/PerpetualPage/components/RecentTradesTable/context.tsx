import { createContext, SetStateAction, Dispatch } from 'react';
import {
  RecentTradesDataEntry,
  TradePriceChange,
  TradeType,
  RecentTradesContextType,
} from './types';
import React, { useState, useEffect } from 'react';
import {
  subscription,
  decodeTradeLogs,
} from 'app/pages/PerpetualPage/utils/bscWebsocket';
import { getContract } from 'utils/blockchain/contract-helpers';
import { useGetRecentTrades } from '../../hooks/graphql/useGetRecentTrades';
import { Subscription } from 'web3-core-subscriptions';
import { BigNumber } from 'ethers';
import { ABK64x64ToFloat } from '../../utils/contractUtils';

export const RecentTradesContext = createContext<{
  trades: RecentTradesDataEntry[];
}>({
  trades: [],
});

const recentTradesMaxLength = 50;
const address = getContract('perpetualManager').address.toLowerCase();

type InitSocketParams = {
  setValue: Dispatch<SetStateAction<RecentTradesContextType>>;
};

const initSockets = ({ setValue }: InitSocketParams, perpetualId: string) => {
  const socket = subscription(address, ['Trade']);

  addSocketEventListeners(socket, { setValue }, perpetualId);

  return socket;
};

const addSocketEventListeners = (
  socket: Subscription<any>,
  { setValue }: InitSocketParams,
  perpetualId: string,
) => {
  /** This can be uncommented for testing */
  // socket.on('connected', () => {
  //   console.log('[recentTradesWs] bsc websocket connected');
  // });

  socket.on('data', data => {
    /** This can be uncommented for testing */
    // console.log('[recentTradesWs] data received');
    const decoded = decodeTradeLogs(data.data, [data.topics[1]]);
    if (decoded.perpetualId.toLowerCase() === perpetualId.toLowerCase()) {
      const price = ABK64x64ToFloat(BigNumber.from(decoded.price));
      const tradeAmount = ABK64x64ToFloat(
        BigNumber.from(decoded.tradeAmountBC),
      );
      const parsedTrade: RecentTradesDataEntry = {
        id: data.transactionHash,
        price,
        size: Math.abs(tradeAmount),
        time: convertTimestampToTime(parseInt(decoded.blockTimestamp) * 1e3),
        type: getTradeType(tradeAmount),
        priceChange: TradePriceChange.NO_CHANGE,
        fromSocket: true,
      };
      setValue(state => {
        const prevPrice = state.trades[0].price;
        parsedTrade.priceChange = getPriceChange(prevPrice, price);
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
    const prevPrice = ABK64x64ToFloat(BigNumber.from(prevTrade.price));
    const price = ABK64x64ToFloat(BigNumber.from(trade.price));
    const tradeAmount = ABK64x64ToFloat(BigNumber.from(trade.tradeAmountBC));
    return {
      id: trade.transaction.id,
      price,
      priceChange: getPriceChange(prevPrice, price),
      size: Math.abs(tradeAmount),
      time: convertTimestampToTime(parseInt(trade.blockTimestamp) * 1e3),
      type: getTradeType(tradeAmount),
      fromSocket: false,
    };
  });
  return parsedData;
};

const getPriceChange = (prevPrice: number, price: number): TradePriceChange => {
  if (prevPrice < price) {
    return TradePriceChange.UP;
  } else if (prevPrice > price) {
    return TradePriceChange.DOWN;
  } else {
    return TradePriceChange.NO_CHANGE;
  }
};

const getTradeType = (tradeAmount: number): TradeType => {
  return tradeAmount < 0 ? TradeType.SELL : TradeType.BUY;
};

const convertTimestampToTime = (timestamp: number): string =>
  new Date(timestamp).toTimeString().slice(0, 8);

export const RecentTradesContextProvider = props => {
  const [value, setValue] = useState<RecentTradesContextType>({
    trades: [],
  });
  const { data, error } = useGetRecentTrades(
    props.pair.id,
    recentTradesMaxLength,
  );
  useEffect(() => {
    if (data) {
      const parsedData = formatTradeData(data.trades);
      setValue({ trades: parsedData });
    }
    if (error) {
      console.error(error);
    }

    if (data || error) {
      let socket = initSockets({ setValue }, props.pair.id);
      return () => {
        if (socket) {
          socket.unsubscribe((error, success) => {
            if (error) {
              console.error(error);
            }
            if (success) {
              return;
            }
          });
        }
      };
    }
  }, [data, error, props.pair.id]);

  return (
    <RecentTradesContext.Provider value={value}>
      {props.children}
    </RecentTradesContext.Provider>
  );
};
