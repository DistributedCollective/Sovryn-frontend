import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.topUpBtcDialog || initialState;

export const selectTopUpBtcDialog = createSelector(
  [selectDomain],
  topUpBtcDialogState => topUpBtcDialogState,
);
