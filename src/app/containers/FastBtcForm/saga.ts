import Rsk from '@rsksmart/rsk3';
import { eventChannel } from 'redux-saga';
import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { actions } from './slice';
import { PayloadAction } from '@reduxjs/toolkit';
import io from 'socket.io-client';
import { currentChainId, fastBtcApis } from '../../../utils/classifiers';
import { selectFastBtcForm } from './selectors';

export function* verifyReceiverWallet({ payload }: PayloadAction<string>) {
  let valid;
  try {
    Rsk.utils.toChecksumAddress(payload);
    valid = true;
  } catch (e) {
    valid = false;
  }
  yield put(actions.changeReceiverAddressValidity(valid));
}

function* callCreateWebSocketChannel({ payload }: PayloadAction<boolean>) {
  if (!payload) {
    yield put(actions.getDepositAddressFailed());
    return;
  }

  const state = yield select(selectFastBtcForm);
  const blockChannel = yield call(createWebSocketChannel, state);
  try {
    while (true) {
      const event = yield take(blockChannel);
      yield put(event);
    }
  } finally {
    console.log('closing channel');
    blockChannel.close();
  }
}

function createWebSocketChannel(state) {
  return eventChannel(emit => {
    const socket = io(fastBtcApis[currentChainId], {
      reconnectionDelayMax: 10000,
    });

    if (state.receiverAddress) {
      // get deposit address
      socket.emit('getDepositAddress', state.receiverAddress, (err, res) => {
        if (res && res.btcadr) {
          emit(actions.getDepositAddressSuccess(res));
        } else {
          console.log('no response here.');
          emit(actions.getDepositAddressFailed());
        }
      });
    }

    socket.emit('txAmount', info => {
      console.log('tx ampunt', info);
      emit(actions.changeAmountInfo(info));
    });
    console.log('ddddddd', state.receiverAddress);
    socket.emit('getDepositHistory', state.receiverAddress, info => {
      console.log('gdh', info);
      emit(actions.setDepositHistory(info));
    });

    socket.on('txAmount', info => emit(actions.changeAmountInfo(info)));

    socket.on('depositTx', tx => emit(actions.changeDepositTx(tx)));
    socket.on('transferTx', tx => emit(actions.changeTransferTx(tx)));
    socket.on('depositError', tx => emit(actions.depositError(tx)));
    socket.on('getDepositHistory', info => {
      console.log('on deposit history', info);
      emit(actions.setDepositHistory(info));
    });

    return () => {
      socket.disconnect();
    };
  });
}

export function* fastBtcFormSaga() {
  yield takeLatest(actions.changeReceiverAddress.type, verifyReceiverWallet);
  yield takeLatest(
    actions.changeReceiverAddressValidity.type,
    callCreateWebSocketChannel,
  );
}
