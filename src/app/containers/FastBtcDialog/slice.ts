import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState, Step, TxId, TxState } from './types';
import { toastError } from '../../../utils/toaster';

// The initial state of the FastBtcDialog container
export const initialState: ContainerState = {
  step: Step.MAIN,
  txId: TxId.DEPOSIT,
  ready: false,
  deposit: {
    loading: false,
    address: '',
  },
  depositTx: {
    txHash: '',
    value: 0,
    status: '',
  },
  transferTx: {
    txHash: '',
    value: 0,
    status: '',
  },
  limits: {
    min: 0,
    max: 0,
  },
};

const fastBtcDialogSlice = createSlice({
  name: 'fastBtcDialog',
  initialState,
  reducers: {
    init(state) {},
    ready(state) {
      state.ready = true;
    },
    // generate deposit address
    generateDepositAddress(state) {
      state.deposit.loading = true;
    },
    generateDepositAddressSuccess(state, { payload }: PayloadAction<string>) {
      state.step = Step.WALLET;
      state.deposit.loading = false;
      state.deposit.address = payload;
    },
    generateDepositAddressFailed(state, { payload }: PayloadAction<string>) {
      toastError(payload, 'fast-btc');
      state.deposit.loading = false;
      state.deposit.address = '';
    },
    // get amount limits
    changeAmountInfo(
      state,
      { payload }: PayloadAction<{ min: number; max: number }>,
    ) {
      state.limits = payload;
    },
    changeDepositTx(state, { payload }: PayloadAction<TxState>) {
      state.depositTx = payload;
      state.step = Step.TRANSACTION;
      state.txId = TxId.DEPOSIT;
    },
    changeTransferTx(state, { payload }: PayloadAction<TxState>) {
      state.transferTx = payload;
      state.step = Step.TRANSACTION;
      state.txId = TxId.TRANSFER;
    },
  },
});

export const { actions, reducer, name: sliceKey } = fastBtcDialogSlice;
