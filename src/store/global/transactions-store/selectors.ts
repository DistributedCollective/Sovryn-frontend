import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.transactionsState || initialState;

export const selectTransactionsState = createSelector(
  [selectDomain],
  eventsState => eventsState,
);

export const selectTransactions = createSelector(
  [selectDomain],
  state => state.transactions,
);

export const selectTransactionStack = createSelector(
  [selectDomain],
  state => state.transactionStack,
);

export const selectTransactionArray = createSelector([selectDomain], state =>
  Object.values(state.transactions),
);

export const selectRequestDialogState = createSelector(
  [selectDomain],
  state => state.requestDialog,
);

export const selectLoadingTransaction = createSelector(
  [selectDomain],
  state => state.loading,
);
