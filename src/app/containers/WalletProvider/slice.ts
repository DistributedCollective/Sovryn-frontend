import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { currentChainId } from 'utils/classifiers';
import { CachedAssetRate, ContainerState } from './types';
import { Nullable } from 'types';

// The initial state of the WalletConnector container
export const initialState: ContainerState = {
  address: '',
  chainId: currentChainId,
  networkId: currentChainId,
  bridgeChainId: null,
  connected: false,
  connecting: false,
  blockNumber: 0,
  syncBlockNumber: 0,
  // todo ?
  transactions: {},
  transactionStack: [],
  whitelist: {
    enabled: process.env.REACT_APP_WHITELIST === 'true',
    loading: false,
    loaded: false,
    whitelisted: false,
    isDialogOpen: false,
  },
  assetRates: [],
  assetRatesLoading: true,
  assetRatesLoaded: false,
  processedBlocks: [],
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
    },

    accountChanged(state, action: PayloadAction<string>) {
      state.address = action.payload || '';
    },

    setBridgeChainId(state, { payload }: PayloadAction<Nullable<number>>) {
      state.bridgeChainId = payload;
    },

    chainChanged(
      state,
      action: PayloadAction<{ chainId?: number; networkId?: number }>,
    ) {
      state.chainId = action.payload.chainId;
      state.networkId = action.payload.networkId;
    },

    connectionError() {},

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
      if (action.payload > state.syncBlockNumber) {
        state.syncBlockNumber = action.payload;
      }
    },

    readerReady() {},

    blockFailed(state, action: PayloadAction<string>) {
      console.error('block failed');
    },
    blockReceived(state, { payload }: PayloadAction<number>) {
      if (payload > state.blockNumber) {
        state.blockNumber = payload;
      }
    },

    processBlock(state, action: PayloadAction<any>) {},
    blockProcessed(state, { payload }: PayloadAction<number>) {
      if (state.processedBlocks.length > 30) {
        state.processedBlocks.shift();
      }
      state.processedBlocks.push(payload);
    },
    whitelistCheck(state) {
      state.whitelist.loading = true;
      state.whitelist.loaded = false;
    },
    addVisit(state, { payload }: PayloadAction<string>) {},
    whitelistChecked(state, { payload }: PayloadAction<boolean>) {
      state.whitelist.whitelisted = payload;
      state.whitelist.isDialogOpen = !payload;
      state.whitelist.loading = false;
      state.whitelist.loaded = true;
    },
    whitelistDialog(state, { payload }: PayloadAction<boolean>) {
      state.whitelist.isDialogOpen = payload;
    },
    getPrices(state) {
      state.assetRatesLoading = true;
    },
    setPrices(state, { payload }: PayloadAction<CachedAssetRate[]>) {
      state.assetRates = payload;
      state.assetRatesLoading = false;
      state.assetRatesLoaded = true;
    },
    setPrice(state, { payload }: PayloadAction<CachedAssetRate>) {
      let prevItems = state.assetRates;
      const index = prevItems.findIndex(
        item =>
          item.source === payload.source && item.target === payload.target,
      );
      if (index !== -1) {
        prevItems[index] = payload;
      } else {
        prevItems = [...prevItems, payload];
      }
      state.assetRates = prevItems;
    },
    testTransactions() {},
    sovrynNetworkReady() {},
    sovrynNetworkError() {},
  },
});

export const { actions, reducer, name: sliceKey } = walletProviderSlice;
