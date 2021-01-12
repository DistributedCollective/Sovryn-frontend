import { eventChannel } from 'redux-saga';
import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import io from 'socket.io-client';
import { currentChainId, fastBtcApis } from 'utils/classifiers';
import { actions } from './slice';
import { actions as wActions } from 'app/containers/WalletProvider/slice';
import { selectWalletProvider } from '../WalletProvider/selectors';
import { Sovryn } from '../../../utils/sovryn';

function* callCreateWebSocketChannel({ payload }: PayloadAction<string>) {
  if (!payload) {
    yield put(actions.getDepositAddressFailed());
    return;
  }

  const blockChannel = yield call(createWebSocketChannel, payload);
  try {
    while (true) {
      const event = yield take(blockChannel);
      yield put(event);
    }
  } finally {
    blockChannel.close();
  }
}

function createWebSocketChannel(receiverAddress) {
  return eventChannel(emit => {
    const { origin, pathname } = new URL(fastBtcApis[currentChainId]);

    const socket = io(`${origin}/`, {
      reconnectionDelayMax: 10000,
      path: pathname && pathname !== '/' ? pathname : '',
    });

    console.log('sockets start', receiverAddress);

    if (receiverAddress) {
      // get deposit address
      socket.emit('getDepositAddress', receiverAddress, (err, res) => {
        if (res && res.btcadr) {
          emit(actions.getDepositAddressSuccess(res));
        } else {
          emit(actions.depositError(err?.error));
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

export function* fastBtcFormSaga() {
  yield takeLatest(
    actions.changeReceiverAddress.type,
    callCreateWebSocketChannel,
  );
  yield takeLatest(wActions.disconnected.type, resetAddresses);
  yield takeLatest(wActions.accountChanged.type, accountChanged);
}
