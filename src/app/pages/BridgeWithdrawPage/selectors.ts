import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.bridgeWithdrawPage || initialState;

export const selectBridgeWithdrawPage = createSelector(
  [selectDomain],
  bridgeDepositPageState => bridgeDepositPageState,
);
