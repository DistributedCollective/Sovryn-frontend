import { PayloadAction } from '@reduxjs/toolkit';
import { bignumber } from 'mathjs';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { BtcDeposit, ContainerState } from './types';
import { Nullable } from '../../../types';

// The initial state of the FastBtcForm container
export const initialState: ContainerState = {
  step: 1,
  maxDeposit: 0,
  minDeposit: 0,
  upgradeLoading: false,
  btcAddressLoading: true,
  btcAddress: null,
  btcMin: 0,
  btcMax: 0,
  btcDeposit: null,
  transferDeposit: null,
  codeTx: null,
  codeError: null,
  requestAccessLoading: false,
  requestAccessError: null,
  showTokenTutorial: false,
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
      state.minDeposit = Number(bignumber(payload).div(2));
    },
    useCode(
      state,
      {
        payload,
      }: PayloadAction<{
        address: string;
        code: string;
      }>,
    ) {
      state.upgradeLoading = true;
      state.codeTx = null;
      state.codeError = null;
    },
    useCodeCompleted(state, { payload }: PayloadAction<string>) {
      state.upgradeLoading = false;
      state.codeTx = payload;
      state.codeError = null;
    },
    useCodeFailed(state, { payload }: PayloadAction<string>) {
      state.upgradeLoading = false;
      state.codeTx = null;
      state.codeError = payload;
    },
    useCodeRequestCompleted(state, { payload }: PayloadAction<boolean>) {
      state.upgradeLoading = payload;
      if (payload) {
        state.step = 4; // buy with btc/rbtc screen
      }
    },
    useCodeCleanup(state) {
      state.upgradeLoading = false;
      state.codeTx = null;
      state.codeError = null;
    },
    requestAccess(state, { payload }: PayloadAction<any>) {
      state.requestAccessLoading = true;
      state.requestAccessError = null;
    },
    requestAccessCompleted(state) {
      state.requestAccessError = null;
      state.requestAccessLoading = false;
      state.step = 5;
    },
    requestAccessFailed(state, { payload }: PayloadAction<string>) {
      state.requestAccessError = payload;
      state.requestAccessLoading = false;
    },
    getBtcAddress(state) {
      state.btcAddressLoading = true;
    },
    getBtcAddressCompleted(
      state,
      { payload }: PayloadAction<Nullable<string>>,
    ) {
      state.btcAddressLoading = false;
      state.btcAddress = payload;
    },
    updateMaxBtcDeposit(
      state,
      { payload }: PayloadAction<{ min: number; max: number }>,
    ) {
      state.btcMin = payload.min;
      state.btcMax = payload.max;
    },
    updateDepositTx(state, { payload }: PayloadAction<Nullable<BtcDeposit>>) {
      state.btcDeposit = payload;
    },
    updateTransferTx(state, { payload }: PayloadAction<Nullable<BtcDeposit>>) {
      state.btcDeposit = payload;
    },
    showTokenTutorial(state, { payload }: PayloadAction<boolean>) {
      state.showTokenTutorial = payload;
    },
  },
});

export const { actions, reducer, name: sliceKey } = SalesSlice;
