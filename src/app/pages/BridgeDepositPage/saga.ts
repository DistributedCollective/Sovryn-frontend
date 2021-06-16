import { call, fork, put, take, takeLatest } from 'redux-saga/effects';
import { actions } from './slice';
import { actions as walletProviderActions } from 'app/containers/WalletProvider/slice';
import {
  getBridgeChain,
  getBridgeChainId,
  getSupportedBridgeChainIds,
} from './utils/helpers';
import { walletService } from '@sovryn/react-wallet';
import { debug } from '@sovryn/common';
import { eventChannel } from 'redux-saga';
import { DepositStep } from './types';
import { Chain } from '../../../types';

const { log } = debug('bridge/saga.ts');

function* selectNetwork(data) {
  const chainId = getBridgeChainId(data.payload.chain);
  console.log(data.payload, chainId);
  yield put(walletProviderActions.setBridgeChainId(chainId));
  const context = data.payload.walletContext;
  yield call([context, context.connect]);
}

function* watchWalletChannel() {
  console.log('create wallet channel');
  const blockChannel = yield call(createWalletChannel);
  try {
    while (true) {
      const event = yield take(blockChannel);
      console.log(event);
      yield put(event);
    }
  } finally {
    blockChannel.close();
  }
}

function createWalletChannel() {
  const events = walletService.events;
  return eventChannel(emit => {
    const connectedFn = () => {
      try {
        if (!walletService.isConnected()) {
          log('not connected');
          emit(actions.setStep(DepositStep.CHAIN_SELECTOR));
        } else if (getBridgeChain(walletService.chainId) === Chain.RSK) {
          log('connected to rsk network');
          emit(actions.setStep(DepositStep.CHAIN_SELECTOR));
        } else if (
          !getSupportedBridgeChainIds().includes(walletService.chainId)
        ) {
          log('unsupported bridge id', walletService.chainId);
          emit(actions.setStep(DepositStep.CHAIN_SELECTOR));
        } else {
          log('connected to new chain');
          emit(actions.setStep(DepositStep.TOKEN_SELECTOR));
        }
      } catch (e) {
        console.error(e);
        emit(actions.setStep(DepositStep.CHAIN_SELECTOR));
      }
    };
    events.on('connected', connectedFn);
    return () => {
      events.off('connected', connectedFn);
    };
  });
}

export function* bridgeDepositPageSaga() {
  yield fork(watchWalletChannel);
  yield takeLatest(actions.selectNetwork.type, selectNetwork);
}
