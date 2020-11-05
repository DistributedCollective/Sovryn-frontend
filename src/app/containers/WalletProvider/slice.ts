import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';
import { currentChainId } from '../../../utils/classifiers';

// The initial state of the WalletConnector container
export const initialState: ContainerState = {
  address: '',
  chainId: currentChainId,
  networkId: currentChainId,
  connected: false,
  connecting: false,
  blockNumber: 0,
  syncBlockNumber: 0,
  // todo ?
  transactions: {},
  transactionStack: [],
};

const walletProviderSlice = createSlice({
  name: 'walletProvider',
  initialState,
  reducers: {
    connect(state) {
      state.connecting = true;
    },
    connected(state, { payload }: PayloadAction<{ address: string }>) {
      state.connected = true;
      state.connecting = false;
      state.address = payload.address || '';
    },

    accountChanged(state, action: PayloadAction<string>) {
      state.address = action.payload || '';
    },

    chainChanged(
      state,
      action: PayloadAction<{ chainId: number; networkId: number }>,
    ) {
      state.chainId = action.payload.chainId;
      state.networkId = action.payload.networkId;
    },

    disconnect() {},

    disconnected(state) {
      state.address = initialState.address;
      state.chainId = initialState.chainId;
      state.networkId = initialState.networkId;
      state.connected = initialState.connected;
      state.connecting = false;
      state.transactions = initialState.transactions;
      state.transactionStack = initialState.transactionStack;
    },

    addTransaction(state, action: PayloadAction<string>) {
      state.transactionStack = [...state.transactionStack, action.payload];
      state.transactions = {
        ...state.transactions,
        [state.transactionStack.length]: action.payload,
      };
    },

    reSync(state, action: PayloadAction<number>) {
      state.syncBlockNumber = action.payload;
    },

    readerReady() {},

    blockFailed(state, action: PayloadAction<string>) {
      console.error('block failed');
    },
    blockReceived(state, action: PayloadAction<any>) {
      state.blockNumber = action.payload.number;
    },

    processBlock(state, action: PayloadAction<any>) {},
  },
});

export const { actions, reducer, name: sliceKey } = walletProviderSlice;
