import { EventData } from 'web3-eth-contract';
import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import { actions } from './slice';
import { actions as walletActions } from 'app/containers/WalletProvider/slice';
import { AssetsDictionary } from 'utils/blockchain/assets-dictionary';
import { LoadEventsParams } from './types';
import { eventReader } from '../../../utils/sovryn/event-reader';

const pools = AssetsDictionary.list();
const protocolEvents = ['Trade', 'CloseWithSwap', 'CloseWithDeposit'];

function* preloadUserEvents({ payload }: PayloadAction<string>) {
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

function* preloadUserEvent({ payload }: PayloadAction<LoadEventsParams>) {
  const result: EventData[] = yield call(
    [eventReader, eventReader.getPastEventsInChunksPromise],
    payload.contractName,
    payload.eventName,
    payload.filters,
  );
  yield put(
    actions.addEvents({
      contractName: payload.contractName,
      eventName: payload.eventName,
      address: payload.address,
      events: JSON.parse(JSON.stringify(result)),
      fromBlock: 0,
      toBlock: 0,
    }),
  );
}

// function createEventChannels({ event, options }) {
//   return eventChannel(emit => {
//     const eventEmitter = event(options, function (e, o) {
//       console.warn('eee', e, o);
//     });
//     console.log('create event channels.');
//     eventEmitter
//       .on('data', event => {
//         console.warn('new event received', event);
//         // emit(actions.blockReceived(blockHeader));
//         // emit({
//         //   type: 'BLOCK_RECEIVED',
//         //   blockHeader,
//         //   web3,
//         //   syncAlways,
//         // });
//       })
//       .on('error', error => {
//         console.error('event error.', error);
//         // emit(actions.blockFailed(error.message));
//         // emit({ type: 'BLOCKS_FAILED', error });
//         emit(END);
//       });
//
//     Sovryn.contracts.sovrynProtocol.events.Trade(options, function (e, o) {
//       console.warn('adad', e, o);
//     });
//
//     return () => {
//       console.log('unsubscribe');
//       eventEmitter.unsubscribe();
//     };
//   });
// }
//
// function* callCreateEventsChannels(
//   contractName: ContractName,
//   eventName: string,
//   options: any,
// ) {
//   const event = Sovryn.contracts[contractName].events[eventName];
//   const blockChannel = yield call(createEventChannels, { event, options });
//
//   console.log('call create events channels');
//
//   try {
//     while (true) {
//       const event = yield take(blockChannel);
//       yield put(event);
//     }
//   } finally {
//     blockChannel.close();
//   }
// }
//
// export function* watchUserEvents({ payload }: PayloadAction<string>) {
//   if (payload) {
//     console.log('watch user events.');
//     yield fork(callCreateEventsChannels, 'sovrynProtocol', 'Trade', {
//       filter: { user: payload },
//       fromBlock: 'latest',
//     });
//   }
// }

export function* eventsStateSaga() {
  yield takeLatest(walletActions.accountChanged.type, preloadUserEvents);
  // yield takeLatest(walletActions.accountChanged.type, watchUserEvents);
  yield takeEvery(actions.loadEvents, preloadUserEvent);
}
