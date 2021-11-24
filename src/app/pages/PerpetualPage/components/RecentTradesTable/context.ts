import React, { createContext } from 'react';

const SocketContext = createContext({
  trades: [],
});

export default SocketContext;
