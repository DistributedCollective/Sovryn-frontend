import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';

const selectDomain = (state: RootState) => state.emailNotification;

export const selectEmailNotification = createSelector(
  [selectDomain],
  emailNotification => emailNotification,
);
