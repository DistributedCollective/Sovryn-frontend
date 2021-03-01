import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

export const initialState: ContainerState = {};

const slice = createSlice({
  name: 'maintenanceState',
  initialState,
  reducers: {
    fetchMaintenanceState() {},
    maintenanceSuccess(state, response) {
      response.payload.map(val => (state[val.name] = val));
    },
    maintenanceFail(state, error) {
      console.log('error state: ', error);
    },
  },
});

export const { actions, reducer, name: maintenanceSlice } = slice;
