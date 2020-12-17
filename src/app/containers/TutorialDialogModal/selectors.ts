import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.tutorialDialogModal || initialState;

export const selectTutorialDialogModal = createSelector(
  [selectDomain],
  tutorialDialogModalState => tutorialDialogModalState,
);
