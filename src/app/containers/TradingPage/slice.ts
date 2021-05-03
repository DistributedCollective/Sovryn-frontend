import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import {
  TradingPairDictionary,
  TradingPairType,
} from 'utils/dictionaries/trading-pair-dictionary';
import { ContainerState, TabType } from './types';

// The initial state of the TradingPage container
export const initialState: ContainerState = {
  tradingPair: TradingPairDictionary.pairTypeList()[0], // Set first pair as default selection.
  swapPair: 'RBTC/SOV',
  isMobileStatsOpen: false,
  tab: TabType.TRADE,
};

const tradingPageSlice = createSlice({
  name: 'tradingPage',
  initialState,
  reducers: {
    changeTradingPair(state, { payload }: PayloadAction<TradingPairType>) {
      state.tradingPair = payload;
    },
    toggleMobileStats(state) {
      state.isMobileStatsOpen = !state.isMobileStatsOpen;
    },
    changeTab(state, { payload }: PayloadAction<TabType>) {
      state.tab = payload;
    },
    changeSwapPair(state, { payload }: PayloadAction<string>) {
      state.swapPair = payload;
    },
  },
});

export const { actions, reducer, name: sliceKey } = tradingPageSlice;
