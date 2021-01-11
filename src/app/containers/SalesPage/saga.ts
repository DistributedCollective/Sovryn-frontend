import { eventChannel } from 'redux-saga';
import { take, call, put, takeLatest, fork, apply } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import io from 'socket.io-client';
import { currentChainId, saleBackend } from 'utils/classifiers';
import { actions } from './slice';
import { actions as wActions } from 'app/containers/WalletProvider/slice';

function createSocketConnection() {
  const { origin, pathname } = new URL(saleBackend[currentChainId]);
  const socket = io(`${origin}/`, {
    reconnectionDelayMax: 10000,
    path: pathname && pathname !== '/' ? pathname : '',
  });
  return new Promise(resolve => {
    socket.on('connect', () => {
      resolve(socket);
    });
  });
}

function createWebSocketChannel(receiverAddress, socket) {
  return eventChannel(emit => {
    // socket.on('getDepositAddress', (...args) => this.getDepositAddress.apply(this, [socket, ...args]));
    // socket.on('getDepositHistory', (...args) => this.getDepositHistory.apply(this, [...args]));
    // socket.on('txAmount', (...args) => this.getTxAmount.apply(this, [...args]));
    // socket.on('getDeposits', (...args) => this.getDbDeposits.apply(this, [...args]));
    //
    // //mint nft
    // socket.on('useCode', (...args) => this.onUserUseCode.apply(this, [socket, ...args]));

    emit(actions.getBtcAddress());
    // get deposit address
    socket.emit('getDepositAddress', receiverAddress, (err, res) => {
      if (res && res.btcadr) {
        emit(actions.getBtcAddressCompleted(res.btcadr));
      } else {
        emit(actions.getBtcAddressCompleted(null));
      }
    });

    // get min/max limits for btc deposit
    socket.emit('txAmount', limits =>
      emit(actions.updateMaxBtcDeposit(limits)),
    );

    // get deposit for event
    socket.on('depositTx', deposit => emit(actions.updateDepositTx(deposit)));
    socket.on('transferTx', transfer =>
      emit(actions.updateTransferTx(transfer)),
    );

    return () => {
      socket.off('depositTx');
      socket.off('transferTx');
      socket.disconnect();
    };
  });
}

const useCodeRequest = (socket, address, code) =>
  new Promise(resolve => {
    socket.emit('useCode', address, code, null, (error, success) => {
      resolve({ error: error?.error || null, success });
    });
  });

function* useCode(socket) {
  while (true) {
    const { payload } = yield take(actions.useCode.type);
    const { address, code } = payload;
    const { error, success } = yield call(
      useCodeRequest,
      socket,
      address,
      code,
    );
    if (error) {
      yield put(actions.useCodeFailed(error));
    }
    if (success) {
      yield put(actions.useCodeCompleted(success));
    }
  }
}

function* emitResponse(socket) {
  yield apply(socket, socket.emit, ['message received']);
}

function* watchSocketChannel({ payload }: PayloadAction<string>) {
  if (!payload) {
    return;
  }
  const socket = yield call(createSocketConnection);
  yield fork(useCode, socket);

  const blockChannel = yield call(createWebSocketChannel, payload, socket);
  try {
    while (true) {
      const event = yield take(blockChannel);
      yield put(event);
      yield fork(emitResponse, socket);
    }
  } finally {
    blockChannel.close();
  }
}

export function* salesPageSaga() {
  yield takeLatest(wActions.accountChanged.type, watchSocketChannel);
}
