import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

import { initialState } from './slice';

const selectDomain = (state: RootState) => state.borrowSovryn || initialState;

export const selectBorrowSovryn = createSelector(
  [selectDomain],
  borrowSovrynState => borrowSovrynState,
);
