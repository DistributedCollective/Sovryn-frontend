import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.maintenanceState || initialState;

export const selectMaintenanceState = createSelector(
  [selectDomain],
  maintenanceState => maintenanceState,
);

export const selectMaintenance = createSelector(
  [selectDomain],
  state => state.states,
);

export const selectLoading = createSelector(
  [selectDomain],
  state => state.loading,
);
