import { createContext, useCallback } from 'react';
import {
  RecentTradesDataEntry,
  TradePriceChange,
  RecentTradesContextType,
} from '../components/RecentTradesTable/types';
import React, { useState, useEffect } from 'react';
import {
  subscription,
  PerpetualManagerEventKeys,
  decodePerpetualManagerLog,
  getWeb3Socket,
} from 'app/pages/PerpetualPage/utils/bscWebsocket';
import { getContract } from 'utils/blockchain/contract-helpers';
import { useGetRecentTrades } from '../hooks/graphql/useGetRecentTrades';
import { Subscription } from 'web3-core-subscriptions';
import { BigNumber } from 'ethers';
import { ABK64x64ToFloat } from '../utils/contractUtils';
import {
  getPriceChange,
  getTradeType,
} from '../components/RecentTradesTable/utils';
import dayjs from 'dayjs';
import { useAccount } from '../../../hooks/useAccount';

export const RecentTradesContext = createContext<RecentTradesContextType>({
  trades: [],
  latestTradeByUser: undefined,
});

const RECENT_TRADES_MAX_LENGTH = 50;
const address = getContract('perpetualManager').address.toLowerCase();

type InitSocketParams = {
  pushTrade: (trade: RecentTradesDataEntry) => void;
};

const initSockets = (socketParams: InitSocketParams, perpetualId: string) => {
  const socket = subscription(address, [
    PerpetualManagerEventKeys.Trade,
    PerpetualManagerEventKeys.Liquidate,
  ]);

  addSocketEventListeners(socket, socketParams, perpetualId);

  return {
    socket,
    web3: getWeb3Socket(),
  };
};

const addSocketEventListeners = (
  socket: Subscription<any>,
  { pushTrade }: InitSocketParams,
  perpetualId: string,
) => {
  /* This can be uncommented for testing */
  // socket.on('connected', () => {
  //   console.log('[recentTradesWs] bsc websocket connected');
  // });

  socket.on('data', data => {
    const decoded = decodePerpetualManagerLog(data);

    /* This can be uncommented for testing */
    // console.log('[recentTradesWs] data received', data, decoded);

    if (decoded?.perpetualId?.toLowerCase() === perpetualId.toLowerCase()) {
      // decoded could be a Trade or a Liquidate Event
      const price = ABK64x64ToFloat(
        BigNumber.from(decoded.price || decoded.liquidationPrice),
      );
      const tradeAmount = ABK64x64ToFloat(
        BigNumber.from(decoded.tradeAmountBC || decoded.amountLiquidatedBC),
      );
      const parsedTrade: RecentTradesDataEntry = {
        id: data.transactionHash,
        trader: decoded.trader,
        price,
        size: Math.abs(tradeAmount),
        time: convertTimestampToTime(parseInt(decoded.blockTimestamp) * 1e3),
        type: getTradeType(tradeAmount),
        priceChange: TradePriceChange.NO_CHANGE,
        fromSocket: true,
      };

      pushTrade(parsedTrade);
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
      trader: trade.trader?.id,
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

const convertTimestampToTime = (timestamp: number): string =>
  dayjs(timestamp).utc().format('HH:mm:ss');

const DISCONNECTION_CHECK_INTERVAL = 5000; // 5s
const DISCONNECTED_UPDATE_INTERVAL = 5000; // 5s

export const RecentTradesContextProvider = props => {
  const [disconnected, setDisconnected] = useState(false);
  const [value, setValue] = useState<RecentTradesContextType>({
    trades: [],
    latestTradeByUser: undefined,
  });

  const account = useAccount().toLowerCase();

  const { data, error, refetch } = useGetRecentTrades(
    props.pair.id,
    RECENT_TRADES_MAX_LENGTH,
  );

  const pushTrade = useCallback(
    (trade: RecentTradesDataEntry) => {
      setDisconnected(false);
      setValue(state => {
        const prevPrice = state.trades[0].price;
        trade.priceChange = getPriceChange(prevPrice, trade.price);
        return {
          ...state,
          latestTradeByUser:
            account && trade.trader?.toLowerCase() === account
              ? trade
              : state.latestTradeByUser,
          trades: [
            trade,
            ...state.trades.slice(0, RECENT_TRADES_MAX_LENGTH - 1),
          ],
        };
      });
    },
    [account],
  );

  useEffect(() => {
    if (data) {
      setValue(value => {
        const trades = formatTradeData(data.trades);
        const latestTradeByUser = trades.find(
          trade => trade.trader?.toLowerCase() === account,
        );
        return {
          latestTradeByUser: latestTradeByUser || value.latestTradeByUser,
          trades,
        };
      });
    }
    if (error) {
      console.error(error);
    }
  }, [account, data, error, props.pair.id]);

  useEffect(() => {
    let { socket, web3 } = initSockets({ pushTrade }, props.pair.id);

    const intervalId = setInterval(() => {
      if (!web3.currentProvider) {
        return;
      }
      setDisconnected(!web3.currentProvider['connected']);
    }, DISCONNECTION_CHECK_INTERVAL);

    return () => {
      clearImmediate(intervalId);
      socket.unsubscribe((error, success) => {
        if (error) {
          console.error(error);
        }
      });
    };
  }, [data, error, pushTrade, props.pair.id]);

  useEffect(() => {
    if (disconnected) {
      const intervalId = setInterval(refetch, DISCONNECTED_UPDATE_INTERVAL);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [disconnected, refetch]);

  return (
    <RecentTradesContext.Provider value={value}>
      {props.children}
    </RecentTradesContext.Provider>
  );
};
