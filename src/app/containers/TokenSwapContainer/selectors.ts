import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.tokenSwapContainer || initialState;

export const selectTokenSwapContainer = createSelector(
  [selectDomain],
  tokenSwapContainerState => tokenSwapContainerState,
);
