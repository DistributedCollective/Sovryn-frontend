import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects';
import { actions as walletActions } from 'app/containers/WalletProvider/slice';
import { AssetsDictionary } from 'utils/blockchain/assets-dictionary';
import { eventReader } from 'utils/sovryn/event-reader';
import { LoadEventsParams } from './types';
import { actions } from './slice';
import { selectEventsState } from './selectors';
import { selectWalletProvider } from '../../../app/containers/WalletProvider/selectors';

const pools = AssetsDictionary.list();
const protocolEvents = ['Trade', 'CloseWithSwap', 'CloseWithDeposit'];

function* preloadUserEvents({ payload }: PayloadAction<string>) {
  if (!payload) {
    return;
  }

  for (let pool of pools) {
    const contractName = pool.getLendingContractName();
    yield put(
      actions.loadEvents({
        address: payload,
        contractName,
        eventName: 'Mint',
        filters: { minter: payload },
      }),
    );
    yield put(
      actions.loadEvents({
        address: payload,
        contractName,
        eventName: 'Burn',
        filters: { burner: payload },
      }),
    );
  }

  for (let eventName of protocolEvents) {
    yield put(
      actions.loadEvents({
        address: payload,
        contractName: 'sovrynProtocol',
        eventName,
        filters: { user: payload },
      }),
    );
  }
}

function* preloadNewUserEvents() {
  const { address } = yield select(selectWalletProvider);
  if (!address) {
    return;
  }
  yield call(preloadUserEvents, {
    payload: address,
    type: walletActions.accountChanged.type,
  });
}

function* preloadUserEvent({ payload }: PayloadAction<LoadEventsParams>) {
  const state = yield select(selectEventsState);
  const proxy =
    state?.[payload.address]?.[payload.contractName]?.[payload.eventName];
  const result = yield call(
    [eventReader, eventReader.getPastEventsInChunksPromise],
    payload.contractName,
    payload.eventName,
    payload.filters,
    { fromBlock: proxy?.lastBlock, toBlock: 'latest' },
  );
  yield put(
    actions.addEvents({
      contractName: payload.contractName,
      eventName: payload.eventName,
      address: payload.address,
      events: JSON.parse(JSON.stringify(result.events)),
      fromBlock: result.fromBlock,
      toBlock: result.toBlock,
    }),
  );
}

export function* eventsStateSaga() {
  yield takeLatest(walletActions.accountChanged.type, preloadUserEvents);
  yield takeEvery(actions.loadEvents.type, preloadUserEvent);
  yield takeEvery(walletActions.blockReceived.type, preloadNewUserEvents);
}
