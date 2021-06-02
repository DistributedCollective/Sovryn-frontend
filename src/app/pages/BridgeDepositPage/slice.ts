import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the BridgeDepositPage container
export const initialState: ContainerState = {};

const bridgeDepositPageSlice = createSlice({
  name: 'bridgeDepositPage',
  initialState,
  reducers: {
    selectNetwork(
      state,
      action: PayloadAction<{ chainId: number; walletContext }>,
    ) {
      //
    },
  },
});

export const { actions, reducer, name: sliceKey } = bridgeDepositPageSlice;
