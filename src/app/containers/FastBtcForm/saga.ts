import { eventChannel } from 'redux-saga';
import { take, call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import io from 'socket.io-client';
import { currentChainId, fastBtcApis } from 'utils/classifiers';
import { actions } from './slice';
import { actions as wActions } from 'app/containers/WalletProvider/slice';

function createSocketConnection() {
  const { origin, pathname } = new URL(fastBtcApis[currentChainId]);
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
    if (receiverAddress) {
      //   // get deposit address
      //   socket.emit('getDepositAddress', receiverAddress, (err, res) => {
      //     if (res && res.btcadr) {
      //       emit(actions.getDepositAddressSuccess(res));
      //     } else {
      //       emit(actions.getDepositAddressFailed(err.error));
      //     }
      //   });
      getHistory(receiverAddress);
    }
    socket.emit('initAddress', receiverAddress, (err, res) => {
      console.log('response');
      console.log(res);

      if (res && res.id) {
        console.log(res);
      } else {
        console.log("Something's wrong. Please try again!");
      }
    });

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function* resetAddresses() {
  yield put(actions.resetAddresses());
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function* watchSocketChannel({ payload }: PayloadAction<string>) {
  if (!payload) {
    yield put(actions.getDepositAddressFailed(null));
    return;
  }
  const socket = yield call(createSocketConnection);

  const blockChannel = yield call(createWebSocketChannel, payload, socket);
  try {
    while (true) {
      const event = yield take(blockChannel);
      yield put(event);
    }
  } finally {
    blockChannel.close();
  }
}

export function* fastBtcFormSaga() {
  yield takeLatest(actions.changeReceiverAddress.type, watchSocketChannel);
  yield takeLatest(wActions.disconnected.type, resetAddresses);
}
