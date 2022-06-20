import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState, ILimitOrder, SpotPairType } from './types';

// The initial state of the SpotTradingPage container
export const initialState: ContainerState = {
  pairType: SpotPairType.RBTC_XUSD,
  pendingLimitOrders: [],
};

const spotTradingPageSlice = createSlice({
  name: 'spotTradingPage',
  initialState,
  reducers: {
    setPairType(state, { payload }: PayloadAction<SpotPairType>) {
      state.pairType = payload;
    },
    addPendingLimitOrders(state, { payload }: PayloadAction<ILimitOrder>) {
      state.pendingLimitOrders = [...state.pendingLimitOrders, payload];
    },
  },
});

export const { actions, reducer, name: sliceKey } = spotTradingPageSlice;
