import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.fastBtcForm || initialState;

export const selectFastBtcForm = createSelector(
  [selectDomain],
  fastBtcFormState => fastBtcFormState,
);
