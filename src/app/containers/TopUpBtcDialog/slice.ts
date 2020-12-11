import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the TopUpBtcDialog container
export const initialState: ContainerState = {
  dialogOpen: true,
};

const topUpBtcDialogSlice = createSlice({
  name: 'topUpBtcDialog',
  initialState,
  reducers: {
    showDialog(state, { payload }: PayloadAction<boolean>) {
      state.dialogOpen = payload;
    },
  },
});

export const { actions, reducer, name: sliceKey } = topUpBtcDialogSlice;
