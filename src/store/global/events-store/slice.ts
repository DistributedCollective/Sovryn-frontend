import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState, LoadEventsParams } from './types';

export const initialState: ContainerState = {};

export function prepareEventDataState(state, payload: LoadEventsParams) {
  if (!state.hasOwnProperty(payload.address)) {
    state[payload.address] = {};
  }

  if (!state[payload.address].hasOwnProperty(payload.contractName)) {
    state[payload.address][payload.contractName] = {};
  }

  if (
    !state[payload.address][payload.contractName].hasOwnProperty(
      payload.eventName,
    )
  ) {
    state[payload.address][payload.contractName][payload.eventName] = {
      loading: true,
      loaded: false,
      events: [],
      lastBlock: 0,
    };
  }
  return state;
}

const slice = createSlice({
  name: 'eventsState',
  initialState,
  reducers: {
    loadEvents(state, { payload }: PayloadAction<LoadEventsParams>) {
      prepareEventDataState(state, payload);
    },
    addEvents(
      state,
      {
        payload,
      }: PayloadAction<
        LoadEventsParams & { events: any[]; fromBlock: number; toBlock: number }
      >,
    ) {
      prepareEventDataState(state, payload);
      const proxy =
        state[payload.address][payload.contractName][payload.eventName];

      proxy.events.push(...payload.events);
      proxy.loaded = true;
      proxy.loading = false;
      if (proxy.lastBlock < payload.toBlock) {
        proxy.lastBlock = payload.toBlock;
      }
    },
  },
});

export const { actions, reducer, name: eventsSlice } = slice;
