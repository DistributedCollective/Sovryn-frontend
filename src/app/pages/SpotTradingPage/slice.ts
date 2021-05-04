import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState, SpotPairType } from './types';
import { Asset } from '../../../types/asset';

// The initial state of the SpotTradingPage container
export const initialState: ContainerState = {
  pairType: SpotPairType.RBTC_SOV,
  collateral: Asset.RBTC,
  amount: '0',
};

const spotTradingPageSlice = createSlice({
  name: 'spotTradingPage',
  initialState,
  reducers: {
    someAction(state, action: PayloadAction<any>) {},
    setPairType(state, { payload }: PayloadAction<SpotPairType>) {
      state.pairType = payload;
    },
  },
});

export const { actions, reducer, name: sliceKey } = spotTradingPageSlice;
