import React, { useState, useEffect } from 'react';
import SocketContext from '../context';
import {
  subscription,
  decodeTradeLogs,
} from 'app/pages/PerpetualPage/utils/bscWebsocket';
import { getContract } from 'utils/blockchain/contract-helpers';
import { TradeEvent } from '../types';

const address = getContract('perpetualManager').address.toLowerCase();
const socket = subscription(address, ['Trade'], 14259519);

const initSockets = ({ setValue }) => {
  socketEvents({ setValue });
};

const socketEvents = ({ setValue }) => {
  socket.on('connected', () => {
    console.log('[socketProvider] bsc websocket connected');
  });

  socket.on('data', data => {
    const decoded = decodeTradeLogs(data.data, [data.topics[1]]);
    const parsedTrade: TradeEvent = {
      address: data.address,
      blockNumber: data.blockNumber,
      logIndex: data.logIndex,
      transactionHash: data.transactionHash,
      transactionIndex: data.transactionIndex,
      perpetualId: decoded.perpetualId,
      price: decoded.price,
      tradeAmount: decoded.tradeAmount,
      trader: decoded.trader,
      blockTimestamp: decoded.blockTimestamp,
      orderFlags: decoded.orderFlags,
    };
    console.log('[socketProvider] parsed trade', parsedTrade);
    setValue(state => {
      return { ...state, trades: [parsedTrade, ...state.trades] };
    });
  });
};

const SocketProvider = props => {
  const [value, setValue] = useState({
    trades: [],
  });

  useEffect(() => initSockets({ setValue }), []);
  return (
    <SocketContext.Provider value={value}>
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
