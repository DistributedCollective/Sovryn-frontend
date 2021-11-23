import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  subscription as bscSubscription,
  decodeTradeLogs,
} from '../../utils/bscWebsocket';

type RecentTradeContextType = {
  trades: object[];
};

export const SocketContext = React.createContext({
  trades: [],
});

export const useWebsocket = () => React.useContext(SocketContext);

export function SocketManager(props) {
  const [trades, setTrades] = useState([]);
  const socket: SocketIOClient.Socket | null = null;

  return (
    <SocketContext.Provider
      value={{
        trades: trades,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
}
