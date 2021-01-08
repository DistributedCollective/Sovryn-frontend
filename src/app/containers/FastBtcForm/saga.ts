import { eventChannel } from 'redux-saga';
import { take, call, put, select, takeLatest, fork, apply } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import io from 'socket.io-client';
import { currentChainId, fastBtcApis } from 'utils/classifiers';
import { actions } from './slice';
import { actions as wActions } from 'app/containers/WalletProvider/slice';
import { selectWalletProvider } from '../WalletProvider/selectors';
import { Sovryn } from '../../../utils/sovryn';

function createSocketConnection() {
  const { origin, pathname } = new URL(fastBtcApis[currentChainId]);
  const socket = io(`${origin}/`, {
    reconnectionDelayMax: 10000,
    path: pathname && pathname !== '/' ? pathname : '',
  });
  return socket;
}

function* writeSocket(socket) {
  while (true) {
    const {payload} = yield take(actions.useCode.type);
    const {address, code, name, email} = payload;
    console.log(address)
    socket.emit('useCode', address, code, {name, email}, (err, success) => {
      if (!err) {
          let ms = "Early access token minted successfully. Feel free to use https://sovryn.app";
          console.log(success);
          //todo: show explore with tx link (tx-hash in "success")             
      } else {
          console.log("Something's wrong. Please try again or contact the admin community@sovryn.app!", true);
      }
    });
  }
}

function* createWebSocketChannel(receiverAddress, socket) {
  return eventChannel(emit => {

    console.log('sockets start', receiverAddress);

    if (receiverAddress) {
      // get deposit address
      socket.emit('getDepositAddress', receiverAddress, (err, res) => {
        if (res && res.btcadr) {
          emit(actions.getDepositAddressSuccess(res));
        } else {
          emit(actions.depositError(res.error));
        }
      });
      getHistory(receiverAddress);
    }

    socket.emit('txAmount', info => {
      emit(actions.changeAmountInfo(info));
    });

    socket.on('txAmount', info => emit(actions.changeAmountInfo(info)));

    socket.on('depositTx', tx => {
      emit(actions.changeDepositTx(tx));
      getHistory(receiverAddress);
    });
    socket.on('transferTx', tx => {
      emit(actions.changeTransferTx(tx));
      getHistory(receiverAddress);
    });
    socket.on('depositError', errorMessage =>
      emit(actions.depositError(errorMessage)),
    );

    getHistory(receiverAddress);

    function getHistory(address: string) {
      socket.emit('getDepositHistory', address, info =>
        emit(actions.setDepositHistory(info)),
      );
    }

    return () => {
      socket.disconnect();
    };
  });
}

function* resetAddresses() {
  yield put(actions.resetAddresses());
}

function* accountChanged() {
  const { address } = yield select(selectWalletProvider);
  if (address) {
    const result = yield call(
      // @ts-ignore
      [Sovryn, Sovryn.getWeb3().eth.getBalance],
      address,
    );
    if (result === '0') {
      yield put(actions.showDialog(true));
    }
  }
}
function* emitResponse(socket) {
  yield apply(socket, socket.emit, ['message received']);
}

function* watchSocketChannel({ payload }: PayloadAction<string>) {
  if (!payload) {
    yield put(actions.getDepositAddressFailed());
    return;
  }
  const socket = yield call(createSocketConnection);
  yield fork(writeSocket, socket);  

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

export function* fastBtcFormSaga() {
  yield takeLatest(
    actions.changeReceiverAddress.type,
    watchSocketChannel,
  );
  yield takeLatest(wActions.disconnected.type, resetAddresses);
  yield takeLatest(wActions.accountChanged.type, accountChanged);
}
