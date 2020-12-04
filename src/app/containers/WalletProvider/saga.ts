import { END, eventChannel } from 'redux-saga';
import {
  call,
  put,
  select,
  take,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { TransactionReceipt } from 'web3-core';
import { Sovryn } from 'utils/sovryn';
import { contractReader } from 'utils/sovryn/contract-reader';
import { selectWalletProvider } from './selectors';
import { actions } from './slice';
import { selectTransactionStack } from '../../../store/global/transactions-store/selectors';
import { actions as txActions } from '../../../store/global/transactions-store/slice';
import { TxStatus } from '../../../store/global/transactions-store/types';

function createBlockChannels({ web3 }) {
  return eventChannel(emit => {
    const blockEvents = web3.eth
      .subscribe('newBlockHeaders', (error, result) => {
        if (error) {
          emit(actions.blockFailed(error.message));

          console.error('Error in block header subscription:');
          console.error(error);

          emit(END);
        }
      })
      .on('data', blockHeader => {
        emit(actions.blockReceived(blockHeader));
        // emit({
        //   type: 'BLOCK_RECEIVED',
        //   blockHeader,
        //   web3,
        //   syncAlways,
        // });
      })
      .on('error', error => {
        emit(actions.blockFailed(error.message));
        // emit({ type: 'BLOCKS_FAILED', error });
        emit(END);
      });

    return () => {
      blockEvents.unsubscribe((error, success) => {});
    };
  });
}

function* callCreateBlockChannels() {
  const web3 = Sovryn.getWeb3();
  const blockChannel = yield call(createBlockChannels, { web3 });

  try {
    while (true) {
      const event = yield take(blockChannel);
      yield put(event);
    }
  } finally {
    blockChannel.close();
  }
}

function* processBlockHeader(event) {
  const { address } = yield select(selectWalletProvider);
  const blockNumber = event.payload.number;
  const web3 = Sovryn.getWeb3();

  try {
    const block = yield call(web3.eth.getBlock, blockNumber, true);
    yield call(processBlock, { block, address });
  } catch (error) {
    console.error('Error in block processing:');
    console.error(error);

    // yield put({ type: 'BLOCK_FAILED', error });
  }
}

function* processBlock({ block, address }) {
  try {
    const transactionStack = yield select(selectTransactionStack);

    if (!block) {
      console.log('no block?');
      return;
    }

    const txs = block.transactions;
    let hasChanges = false;

    if (txs.length > 0) {
      for (let i = 0; i < txs.length; i++) {
        const from = (txs[i].from || '').toLowerCase();
        const to = (txs[i].to || '').toLowerCase();
        const hash: string = txs[i].hash || '';

        if (transactionStack.includes(hash) && from === address.toLowerCase()) {
          const receipt: TransactionReceipt = yield call(
            [Sovryn, Sovryn.getWeb3().eth.getTransactionReceipt],
            hash,
          );
          if (receipt?.status) {
            hasChanges = true;
          }
          yield put(
            txActions.updateTransactionStatus({
              transactionHash: hash,
              status: receipt.status ? TxStatus.CONFIRMED : TxStatus.FAILED,
            }),
          );
        }

        const hasContract = Sovryn.contractList.find(contract => {
          const address = contract.options.address.toLowerCase();
          return address === from || address === to;
        });

        if (hasContract) {
          hasChanges = true;
        }

        if (
          address &&
          (address.toLowerCase() === from || address.toLowerCase() === from)
        ) {
          hasChanges = true;
        }
      }
    }

    if (hasChanges) {
      yield put(actions.reSync(block.number));
    }
  } catch (error) {
    console.error('Error in block processing:');
    console.error(error);
    // yield put({ type: 'BLOCK_FAILED', error });
  }
}

function* walletConnected({ payload }: PayloadAction<{ address: string }>) {
  yield put(actions.accountChanged(payload.address));
}

function* walletDisconnected() {
  yield put(actions.accountChanged(''));
}

function* accountChangedSaga({ payload }: PayloadAction<{ address: string }>) {
  const state = yield select(selectWalletProvider);
  if (state.whitelist.enabled) {
    yield put(actions.whitelistCheck());
  }
}

function* whitelistCheckSaga() {
  const state = yield select(selectWalletProvider);
  try {
    const result = yield call(
      [contractReader, contractReader.call],
      'whitelistToken' as any,
      'balanceOf',
      [state.address],
    );
    yield put(actions.whitelistChecked(result > 0));
  } catch (e) {
    yield put(actions.whitelistChecked(false));
  }
}

export function* walletProviderSaga() {
  yield takeLatest(actions.chainChanged.type, callCreateBlockChannels);
  yield takeLatest(actions.connected.type, walletConnected);
  yield takeLatest(actions.disconnected.type, walletDisconnected);
  yield takeEvery(actions.blockReceived.type, processBlockHeader);
  yield takeEvery(actions.accountChanged.type, accountChangedSaga);
  yield takeEvery(actions.whitelistCheck.type, whitelistCheckSaga);
}
