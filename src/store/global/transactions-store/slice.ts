import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState, Transaction } from './types';

export const initialState: ContainerState = {
  transactionStack: [],
  transactions: {},
};

// export function prepareEventDataState(state, payload: LoadEventsParams) {
//   if (!state.hasOwnProperty(payload.address)) {
//     state[payload.address] = {};
//   }
//
//   if (!state[payload.address].hasOwnProperty(payload.contractName)) {
//     state[payload.address][payload.contractName] = {};
//   }
//
//   if (
//     !state[payload.address][payload.contractName].hasOwnProperty(
//       payload.eventName,
//     )
//   ) {
//     state[payload.address][payload.contractName][payload.eventName] = {
//       loading: true,
//       loaded: false,
//       events: [],
//       lastBlock: 0,
//     };
//   }
//   return state;
// }

const slice = createSlice({
  name: 'transactionsState',
  initialState,
  reducers: {
    addTransaction(state, { payload }: PayloadAction<Transaction>) {
      state.transactionStack.push(payload.transactionHash);
      state.transactions[payload.transactionHash] = payload;
    },
  },
});

export const { actions, reducer, name: transactionsSlice } = slice;
