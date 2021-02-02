import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.salesPage || initialState;

export const selectSalesPage = createSelector(
  [selectDomain],
  salesPageState => salesPageState,
);
