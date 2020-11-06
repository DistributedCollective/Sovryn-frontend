import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.eventsState || initialState;

export const selectEventsState = createSelector(
  [selectDomain],
  eventsState => eventsState,
);
