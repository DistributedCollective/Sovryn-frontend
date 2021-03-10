import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.fastBtcDialog || initialState;

export const selectFastBtcDialog = createSelector(
  [selectDomain],
  fastBtcDialogState => fastBtcDialogState,
);
