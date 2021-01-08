import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the FastBtcForm container
export const initialState: ContainerState = {
  step: 1,
  maxDeposit: 0,
};

const SalesSlice = createSlice({
  name: 'salesPage',
  initialState,
  reducers: {
    changeStep(state, { payload }: PayloadAction<number>) {
      state.step = payload;
    },
    updateMaxDeposit(state, { payload }: PayloadAction<number>) {
      state.maxDeposit = payload;
    },
  },
});

export const { actions, reducer, name: sliceKey } = SalesSlice;
