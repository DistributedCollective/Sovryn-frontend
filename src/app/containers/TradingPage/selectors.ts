import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.tradingPage || initialState;

export const selectTradingPage = createSelector(
  [selectDomain],
  tradingPageState => tradingPageState,
);
