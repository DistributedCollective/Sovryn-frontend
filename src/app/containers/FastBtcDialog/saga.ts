import { eventChannel } from 'redux-saga';
import { take, call, put, takeLatest, fork, select } from 'redux-saga/effects';
import { io } from 'socket.io-client';
import { currentChainId, fastBtcApis } from 'utils/classifiers';
import { actions } from './slice';
import { selectWalletProvider } from '../WalletProvider/selectors';
import { actions as wActions } from '../WalletProvider/slice';

function createSocketConnection() {
  const { origin, pathname } = new URL(fastBtcApis[currentChainId]);
  const socket = io(`${origin}/`, {
    reconnectionDelayMax: 10000,
    reconnectionAttempts: process.env.NODE_ENV === 'production' ? 15 : 3,
    path: pathname && pathname !== '/' ? pathname : '',
  });
  return new Promise(resolve => {
    socket.on('connect', () => {
      resolve(socket);
    });
  });
}

function createWebSocketChannel(socket) {
  return eventChannel(emit => {
    socket.emit('txAmount', limits => emit(actions.changeAmountInfo(limits)));

    socket.on('txAmount', limits => emit(actions.changeAmountInfo(limits)));
    socket.on('depositTx', tx => emit(actions.changeDepositTx(tx)));
    socket.on('transferTx', tx => emit(actions.changeTransferTx(tx)));
    return () => {
      socket.off('txAmount');
      socket.off('depositTx');
      socket.off('transferTx');
      socket.disconnect();
    };
  });
}

const getBtcAddressRequest = (socket, address) =>
  new Promise(resolve => {
    socket.emit('getDepositAddress', address, (err, res) => {
      resolve({ err, res });
    });
  });

function* generateDepositAddress(socket) {
  while (true) {
    yield take(actions.generateDepositAddress.type);
    const { address } = yield select(selectWalletProvider);
    const { res, err } = yield call(getBtcAddressRequest, socket, address);
    if (res && res.btcadr) {
      yield put(actions.generateDepositAddressSuccess(res));
    } else {
      yield put(actions.generateDepositAddressFailed(err?.error));
    }
  }
}

function* generateFiatDepositAddress(socket) {
  while (true) {
    yield take(actions.generateFiatDepositAddress.type);
    const { address } = yield select(selectWalletProvider);
    const { res, err } = yield call(getBtcAddressRequest, socket, address);
    if (res && res.btcadr) {
      yield put(actions.generateFiatDepositAddressSuccess(res));
    } else {
      yield put(actions.generateFiatDepositAddressFailed(err?.error));
    }
  }
}

const getDepositHistoryRequest = (socket, address) =>
  new Promise(resolve => {
    socket.emit('getDepositHistory', address, res => {
      resolve(res);
    });
  });

function* getDepositHistory(socket) {
  while (true) {
    const { payload: address } = yield take(actions.getHistory.type);
    const res = yield call(getDepositHistoryRequest, socket, address);
    if (res?.error) {
      yield put(actions.getHistoryFailed(res?.error));
    } else {
      yield put(actions.getHistorySuccess(res));
    }
  }
}

function* watchSocketChannel() {
  const socket = yield call(createSocketConnection);
  yield fork(generateDepositAddress, socket);
  yield fork(getDepositHistory, socket);
  yield fork(generateFiatDepositAddress, socket);
  const blockChannel = yield call(createWebSocketChannel, socket);
  try {
    yield put(actions.ready());
    while (true) {
      const event = yield take(blockChannel);
      yield put(event);
    }
  } finally {
    blockChannel.close();
  }
}

function* resetData() {
  yield put(actions.reset());
}

export function* fastBtcDialogSaga() {
  yield takeLatest(actions.init.type, watchSocketChannel);
  yield takeLatest(wActions.accountChanged.type, watchSocketChannel);
  yield takeLatest(wActions.accountChanged.type, resetData);
}
