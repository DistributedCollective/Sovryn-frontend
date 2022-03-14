import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState, Transaction, TxStatus, TxType } from './types';
import { Asset } from '../../../types/asset';

export const initialState: ContainerState = {
  transactionStack: [],
  transactions: {},
  loading: false,
  requestDialog: {
    open: false,
    type: TxType.NONE,
    amount: '0',
    asset: null,
    error: null,
  },
};

const slice = createSlice({
  name: 'transactionsState',
  initialState,
  reducers: {
    addTransaction(state, { payload }: PayloadAction<Transaction>) {
      state.transactionStack.push(payload.transactionHash);
      state.transactions[payload.transactionHash] = payload;
    },
    updateTransactionStatus(
      state,
      { payload }: PayloadAction<{ transactionHash: string; status: TxStatus }>,
    ) {
      if (state.transactions.hasOwnProperty(payload.transactionHash)) {
        state.transactions[payload.transactionHash].status = payload.status;
        state.transactions[payload.transactionHash].loading = false;
      }
    },
    setLoading(state, { payload }: PayloadAction<boolean>) {
      state.loading = payload;
    },
    openTransactionRequestDialog(
      state,
      {
        payload,
      }: PayloadAction<{
        type: TxType;
        amount?: string;
        asset?: Asset | string;
      }>,
    ) {
      state.requestDialog.open = true;
      state.requestDialog.type = payload.type;
      state.requestDialog.asset = payload.asset || null;
      state.requestDialog.amount = payload.amount || '0';
      state.requestDialog.error = null;
    },
    closeTransactionRequestDialog(state) {
      state.requestDialog.open = false;
      state.requestDialog.type = TxType.NONE;
      state.requestDialog.asset = null;
      state.requestDialog.amount = '0';
    },
    setTransactionRequestDialogError(
      state,
      { payload }: PayloadAction<string>,
    ) {
      state.requestDialog.error = payload;
    },
  },
});

export const { actions, reducer, name: transactionsSlice } = slice;
