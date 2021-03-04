import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

export const initialState: ContainerState = { states: {}, loading: false };

const slice = createSlice({
  name: 'maintenanceState',
  initialState,
  reducers: {
    fetchMaintenance(state) {
      state.loading = true;
    },
    maintenanceSuccess(state, response) {
      response.payload.map(val => (state.states[val.name] = val));
      state.loading = false;
    },
    maintenanceFail(state, error) {
      state.loading = false;
    },
  },
});

export const { actions, reducer, name: maintenanceSlice } = slice;
