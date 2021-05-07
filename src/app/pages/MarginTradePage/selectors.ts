import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.marginTradePage || initialState;

export const selectMarginTradePage = createSelector(
  [selectDomain],
  marginTradePageState => marginTradePageState,
);
