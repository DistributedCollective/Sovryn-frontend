import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the WalletProvider container
export const initialState: ContainerState = {
  address: '',
  chainId: Number(process.env.REACT_APP_NETWORK_ID),
  networkId: Number(process.env.REACT_APP_NETWORK_ID),
  connected: false,
  // todo ?
  transactions: {},
  transactionStack: [],
};

const walletProviderSlice = createSlice({
  name: 'walletProvider',
  initialState,
  reducers: {
    connect() {},
    connected(
      state,
      { payload }: PayloadAction<{ address; networkId; chainId }>,
    ) {
      state.connected = true;
      state.address = payload.address;
      state.networkId = payload.networkId;
      state.chainId = payload.chainId;
    },

    accountChanged(state, action: PayloadAction<string>) {
      state.address = action.payload;
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
  },
});

export const { actions, reducer, name: sliceKey } = walletProviderSlice;
