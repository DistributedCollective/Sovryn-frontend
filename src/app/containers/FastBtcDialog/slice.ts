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
    receiver: '',
  },
  history: {
    loading: false,
    items: [],
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
    init(state) {
      state.ready = false;
    },
    ready(state) {
      state.ready = true;
    },
    reset(state) {
      state.deposit.address = '';
      state.deposit.receiver = '';
      state.deposit.loading = false;
      state.step = Step.MAIN;
      state.txId = TxId.DEPOSIT;
      state.history.loading = false;
      state.history.items = [];
    },
    selectBTC(state) {
      state.step = Step.WALLET;
    },
    selectFiat(state) {
      state.step = Step.FIAT;
    },
    // generate deposit address
    generateDepositAddress(state) {
      state.deposit.loading = true;
    },
    generateDepositAddressSuccess(
      state,
      { payload }: PayloadAction<{ btcadr: string; web3adr: string }>,
    ) {
      state.deposit.loading = false;
      state.deposit.address = payload.btcadr;
      state.deposit.receiver = payload.web3adr;
    },
    generateDepositAddressFailed(state, { payload }: PayloadAction<string>) {
      toastError(payload, 'fast-btc');
      state.deposit.loading = false;
      state.deposit.address = '';
      state.deposit.receiver = '';
    },
    // generate Fiat deposit address
    generateFiatDepositAddress(state) {
      state.deposit.loading = true;
    },
    generateFiatDepositAddressSuccess(
      state,
      { payload }: PayloadAction<{ btcadr: string; web3adr: string }>,
    ) {
      state.deposit.loading = false;
      state.deposit.address = payload.btcadr;
      state.deposit.receiver = payload.web3adr;
      state.step = Step.TRANSAK;
    },
    generateFiatDepositAddressFailed(
      state,
      { payload }: PayloadAction<string>,
    ) {
      toastError(payload, 'fast-btc');
      state.deposit.loading = false;
      state.deposit.address = '';
      state.deposit.receiver = '';
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
    // get history
    getHistory(state, { payload }: PayloadAction<string>) {
      state.history.loading = true;
    },
    getHistorySuccess(state, { payload }: PayloadAction<any[]>) {
      state.history.items = payload;
      state.history.loading = false;
    },
    getHistoryFailed(state, { payload }: PayloadAction<string>) {
      toastError(payload, 'fast-btc');
      state.history.items = [];
      state.history.loading = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = fastBtcDialogSlice;
