import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the SpotTradingPage container
export const initialState: ContainerState = {};

const spotTradingPageSlice = createSlice({
  name: 'spotTradingPage',
  initialState,
  reducers: {
    someAction(state, action: PayloadAction<any>) {},
  },
});

export const { actions, reducer, name: sliceKey } = spotTradingPageSlice;
