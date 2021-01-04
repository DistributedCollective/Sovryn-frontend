import { createSlice } from '../../../utils/@reduxjs/toolkit';
import { ContainerState } from './types';

export const initialState: ContainerState = {
  modalType: null,
};

const tutorialDialogModalSlice = createSlice({
  name: 'tutorialSOVModal',
  initialState,
  reducers: {
    showModal(state, { payload }) {
      state.modalType = payload;
    },
    hideModal(state) {
      state.modalType = null;
    },
  },
});

export const { actions, reducer, name: sliceKey } = tutorialDialogModalSlice;
