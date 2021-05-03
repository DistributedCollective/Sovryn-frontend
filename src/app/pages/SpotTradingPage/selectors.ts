import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.spotTradingPage || initialState;

export const selectSpotTradingPage = createSelector(
  [selectDomain],
  spotTradingPageState => spotTradingPageState,
);
