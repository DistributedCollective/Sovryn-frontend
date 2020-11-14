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
  whitelist: {
    enabled:
      !!process.env.REACT_APP_WHITELIST_TOKEN &&
      process.env.REACT_APP_WHITELIST === 'true',
    loading: false,
    loaded: false,
    whitelisted: false,
    isDialogOpen: false,
  },
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
      console.log('account changed', action.payload);
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

    whitelistCheck(state) {
      state.whitelist.loading = true;
      state.whitelist.loaded = false;
    },
    whitelistChecked(state, { payload }: PayloadAction<boolean>) {
      state.whitelist.whitelisted = payload;
      state.whitelist.isDialogOpen = !payload;
      state.whitelist.loading = false;
      state.whitelist.loaded = true;
    },
    whitelistDialog(state, { payload }: PayloadAction<boolean>) {
      state.whitelist.isDialogOpen = payload;
    },
  },
});

export const { actions, reducer, name: sliceKey } = walletProviderSlice;
