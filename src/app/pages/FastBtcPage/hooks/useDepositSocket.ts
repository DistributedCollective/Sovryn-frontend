import { useRef, useEffect, useCallback } from 'react';
import { Socket, io } from 'socket.io-client';
import { currentChainId, fastBtcApis } from 'utils/classifiers';

type EventHandler = (event: string, value: any) => void;

export function useDepositSocket(eventHandler?: EventHandler) {
  const socket = useRef<Socket>();

  const handleInput = useCallback(
    (type: any) => (value: any) => {
      if (eventHandler) {
        eventHandler(type, value);
      }
    },
    [eventHandler],
  );

  useEffect(() => {
    const { origin, pathname } = new URL(fastBtcApis[currentChainId]);

    socket.current = io(`${origin}/`, {
      reconnectionDelayMax: 10000,
      reconnectionAttempts: process.env.NODE_ENV === 'production' ? 5 : 1,
      path: pathname && pathname !== '/' ? pathname : '',
    });

    socket.current.on('connect', () => {
      const s = socket.current;
      s?.on('txAmount', handleInput('txAmount'));
      s?.on('depositTx', handleInput('depositTx'));
      s?.on('transferTx', handleInput('transferTx'));
    });

    return () => {
      if (socket.current) {
        const s = socket.current;
        s.off('txAmount');
        s.off('depositTx');
        s.off('transferTx');
        s.disconnect();
        socket.current = undefined;
      }
    };
  }, [handleInput]);

  const getDepositAddress = useCallback(
    (address: string) =>
      new Promise<{
        btcadr: string;
        dateAdded: number;
        id: number;
        label: string;
        web3adr: string;
      }>((resolve, reject) => {
        if (socket.current) {
          socket.current.emit('getDepositAddress', address, (err, res) => {
            if (res) {
              resolve(res);
            } else {
              reject(new Error(err?.error || err));
            }
          });
        } else {
          reject(new Error('socket not connected'));
        }
      }),
    [],
  );

  const getDepositHistory = useCallback(
    (address: string) =>
      new Promise((resolve, reject) => {
        if (socket.current) {
          socket.current.emit('getDepositHisotory', address, res =>
            resolve(res),
          );
        } else {
          reject(new Error('socket not connected'));
        }
      }),
    [],
  );

  const getTxAmount = useCallback(
    () =>
      new Promise<{ min: number; max: number }>((resolve, reject) => {
        if (socket.current) {
          socket.current.emit('txAmount', res => resolve(res));
        } else {
          reject(new Error('socket not connected'));
        }
      }),
    [],
  );

  return {
    ready: socket.current?.connected || false,
    getDepositAddress,
    getDepositHistory,
    getTxAmount,
  };
}
