import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.perpetualPage || initialState;

export const selectPerpetualPage = createSelector(
  [selectDomain],
  perpetualPageState => perpetualPageState,
);
