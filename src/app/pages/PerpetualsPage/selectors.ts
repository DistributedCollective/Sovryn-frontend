import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.perpetualsPage || initialState;

export const selectPerpetualsPage = createSelector(
  [selectDomain],
  perpetualsPageState => perpetualsPageState,
);
