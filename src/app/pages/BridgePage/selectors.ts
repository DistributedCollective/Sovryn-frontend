import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.bridgePage || initialState;

export const selectBridgePage = createSelector(
  [selectDomain],
  bridgePageState => bridgePageState,
);
