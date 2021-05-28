import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.lendBorrowSovryn || initialState;

export const selectLendBorrowSovryn = createSelector(
  [selectDomain],
  lendBorrowSovrynState => lendBorrowSovrynState,
);
