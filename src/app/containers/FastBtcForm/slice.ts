import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState, DepositTx, TransferTx } from './types';
import { toaster } from '../../../utils/toaster';

// The initial state of the FastBtcForm container
export const initialState: ContainerState = {
  dialogOpen: false,
  step: 1,
  receiverAddress: '',
  generatingAddress: false,
  depositAddress: '',
  minDepositAmount: 0,
  maxDepositAmount: 0,
  isDepositLoading: false,
  depositTx: null,
  transferTx: null,
  depositError: '',
  history: [],
  isHistoryLoading: true,
};

const fastBtcFormSlice = createSlice({
  name: 'fastBtcForm',
  initialState,
  reducers: {
    changeStep(state, { payload }: PayloadAction<number>) {
      state.step = payload;
    },
    changeReceiverAddress(state, { payload }: PayloadAction<string>) {
      state.receiverAddress = payload;
      state.generatingAddress = true;
      state.isHistoryLoading = true;
    },
    getDepositAddressSuccess(
      state,
      {
        payload,
      }: PayloadAction<{ btcadr: string; web3adr: string; label: string }>,
    ) {
      state.receiverAddress = payload.web3adr;
      state.depositAddress = payload.btcadr;
      state.generatingAddress = false;
    },
    getDepositAddressFailed(state) {
      state.depositAddress = '';
      state.generatingAddress = false;
    },
    changeAmountInfo(
      state,
      { payload }: PayloadAction<{ min: number; max: number }>,
    ) {
      state.maxDepositAmount = payload.max;
      state.minDepositAmount = payload.min;
    },
    changeDepositTx(state, { payload }: PayloadAction<DepositTx>) {
      state.depositTx = payload;
      if (payload) {
        state.step = 3;
      }
    },
    changeTransferTx(state, { payload }: PayloadAction<TransferTx>) {
      state.transferTx = payload;
      if (payload) {
        state.step = 3;
      }
    },
    depositError(state, { payload }: PayloadAction<string>) {
      toaster.show({
        intent: 'warning',
        message: 'Fast-BTC - Deposit failed with error.',
        timeout: 0,
      });
      state.depositError = payload;
    },
    setDepositHistory(state, { payload }: PayloadAction<Array<any>>) {
      state.history = payload;
      state.isHistoryLoading = false;
    },
    reset(state) {
      state.depositTx = null;
      state.transferTx = null;
      state.step = 2;
    },
    showDialog(state, { payload }: PayloadAction<boolean>) {
      state.dialogOpen = payload;
    },
    resetAddresses(state) {
      state.step = 1;
      state.depositAddress = '';
      state.receiverAddress = '';
      state.generatingAddress = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = fastBtcFormSlice;
