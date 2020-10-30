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
    blockChannel.close();
  }
}

function createWebSocketChannel(state) {
  return eventChannel(emit => {
    const { origin, pathname } = new URL(fastBtcApis[currentChainId]);

    const socket = io(origin, {
      reconnectionDelayMax: 10000,
      path: pathname,
    });

    if (state.receiverAddress) {
      // get deposit address
      socket.emit('getDepositAddress', state.receiverAddress, (err, res) => {
        if (res && res.btcadr) {
          emit(actions.getDepositAddressSuccess(res));
        } else {
          emit(actions.depositError(res.error));
        }
      });
    }

    socket.emit('txAmount', info => {
      emit(actions.changeAmountInfo(info));
    });

    socket.on('txAmount', info => emit(actions.changeAmountInfo(info)));

    socket.on('depositTx', tx => {
      emit(actions.changeDepositTx(tx));
      getHistory();
    });
    socket.on('transferTx', tx => {
      emit(actions.changeTransferTx(tx));
      getHistory();
    });
    socket.on('depositError', errorMessage =>
      emit(actions.depositError(errorMessage)),
    );
    getHistory();

    function getHistory() {
      socket.on('getDepositHistory', info => {
        emit(actions.setDepositHistory(info));
      });
    }

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
