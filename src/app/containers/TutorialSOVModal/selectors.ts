import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.tutorialSOVModal || initialState;

export const selectTutorialSOVModal = createSelector(
  [selectDomain],
  tutorialSOVModalState => tutorialSOVModalState,
);
