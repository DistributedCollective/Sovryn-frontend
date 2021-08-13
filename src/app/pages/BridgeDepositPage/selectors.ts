import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.bridgeDepositPage || initialState;

export const selectBridgeDepositPage = createSelector(
  [selectDomain],
  bridgeDepositPageState => bridgeDepositPageState,
);
