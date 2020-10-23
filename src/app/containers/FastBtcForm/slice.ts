import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the FastBtcForm container
export const initialState: ContainerState = {
  step: 1,
  receiverAddress: '',
  isReceiverAddressValidating: false,
  isReceiverAddressValid: true,
  depositAddress: '',
  minDepositAmount: 0,
  maxDepositAmount: 0,
  isDepositLoading: false,
  depositTx: '',
  transferTx: '',
  depositError: '',
  history: [],
};

const fastBtcFormSlice = createSlice({
  name: 'fastBtcForm',
  initialState,
  reducers: {
    changeReceiverAddress(state, { payload }: PayloadAction<string>) {
      state.receiverAddress = payload;
      state.isReceiverAddressValidating = true;
    },
    changeReceiverAddressValidity(state, { payload }: PayloadAction<boolean>) {
      state.isReceiverAddressValid = payload;
    },
    getDepositAddressSuccess(
      state,
      {
        payload,
      }: PayloadAction<{ btcadr: string; web3adr: string; label: string }>,
    ) {
      state.receiverAddress = payload.web3adr;
      state.depositAddress = payload.btcadr;
      state.isReceiverAddressValidating = false;
    },
    getDepositAddressFailed(state) {
      state.depositAddress = '';
      state.isReceiverAddressValidating = false;
    },
    changeAmountInfo(
      state,
      { payload }: PayloadAction<{ min: number; max: number }>,
    ) {
      console.warn('amounts', payload);
      state.maxDepositAmount = payload.max;
      state.minDepositAmount = payload.min;
    },
    changeDepositTx(state, { payload }: PayloadAction<string>) {
      console.warn('deposit tx', payload);
      state.depositTx = payload;
    },
    changeTransferTx(state, { payload }: PayloadAction<string>) {
      console.warn('transfer tx', payload);
      state.transferTx = payload;
    },
    depositError(state, { payload }: PayloadAction<string>) {
      console.warn('deposit error', payload);
      state.depositError = payload;
    },
    setDepositHistory(state, { payload }: PayloadAction<Array<any>>) {
      console.warn('history', payload);
      state.history = payload;
    },
  },
});

export const { actions, reducer, name: sliceKey } = fastBtcFormSlice;
