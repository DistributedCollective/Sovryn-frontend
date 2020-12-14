import Rsk from '@rsksmart/rsk3';
import { eventChannel } from 'redux-saga';
import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import io from 'socket.io-client';
import { currentChainId, fastBtcApis } from 'utils/classifiers';
import { actions } from './slice';
import { selectFastBtcForm } from './selectors';
import { actions as wActions } from 'app/containers/WalletProvider/slice';
import { selectWalletProvider } from '../WalletProvider/selectors';
import { Sovryn } from '../../../utils/sovryn';

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

    const socket = io(`${origin}/`, {
      reconnectionDelayMax: 10000,
      path: pathname && pathname !== '/' ? pathname : '',
    });

    if (state.receiverAddress) {
      // get deposit address
      socket.emit('getDepositAddress', state.receiverAddress, (err, res) => {
        console.log('get deposit address', res);
        if (res && res.btcadr) {
          emit(actions.getDepositAddressSuccess(res));
        } else {
          emit(actions.depositError(res.error));
        }
      });
      getHistory(state.receiverAddress);
    }

    socket.emit('txAmount', info => {
      console.log('get tx amount', info);
      emit(actions.changeAmountInfo(info));
    });

    socket.on('txAmount', info => emit(actions.changeAmountInfo(info)));

    socket.on('depositTx', tx => {
      console.log('get deposit tx', tx);
      emit(actions.changeDepositTx(tx));
      getHistory(state.receiverAddress);
    });
    socket.on('transferTx', tx => {
      console.log('get transfer tx', tx);
      emit(actions.changeTransferTx(tx));
      getHistory(state.receiverAddress);
    });
    socket.on('depositError', errorMessage =>
      emit(actions.depositError(errorMessage)),
    );

    getHistory(state.receiverAddress);

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
  yield takeLatest(actions.changeReceiverAddress.type, verifyReceiverWallet);
  yield takeLatest(
    actions.changeReceiverAddressValidity.type,
    callCreateWebSocketChannel,
  );
  yield takeLatest(wActions.disconnected.type, resetAddresses);
  yield takeLatest(wActions.accountChanged.type, accountChanged);
}
