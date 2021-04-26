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
import { selectWalletProvider } from './selectors';
import { actions } from './slice';
import { selectTransactionArray } from '../../../store/global/transactions-store/selectors';
import { actions as txActions } from '../../../store/global/transactions-store/slice';
import { TxStatus } from '../../../store/global/transactions-store/types';
import { whitelist } from '../../../utils/whitelist';
import delay from '@redux-saga/delay-p';
import axios from 'axios';
import { contractReader } from '../../../utils/sovryn/contract-reader';
import { backendUrl, currentChainId } from '../../../utils/classifiers';

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
  const { address, processedBlocks } = yield select(selectWalletProvider);
  const blockNumber = event.payload.number;
  const web3 = Sovryn.getWeb3();

  try {
    const previousBlocks = Array(5)
      .fill(blockNumber)
      .map((number, index) => number - index);
    const blocksToProcess = previousBlocks
      .filter(x => !processedBlocks.includes(x))
      .reverse();
    for (const number of blocksToProcess) {
      const block = yield call(web3.eth.getBlock, number, true);
      yield call(processBlock, { block, address });
    }
  } catch (error) {
    console.error('Error in block processing:');
    console.error(error);
  }
}

function* processBlock({ block, address }) {
  try {
    const user = address.toLowerCase();

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

        const hasContract = Sovryn.contractList.find(contract => {
          const contractAddress = contract.options.address.toLowerCase();
          return contractAddress === from || contractAddress === to;
        });

        if (hasContract) {
          hasChanges = true;
        }

        if (user && (user === from || user === from)) {
          hasChanges = true;
        }
      }
    }

    yield put(actions.blockProcessed(block.number));
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

function* accountChangedSaga({ payload }: PayloadAction<string>) {
  const state = yield select(selectWalletProvider);
  if (state.whitelist.enabled) {
    yield put(actions.whitelistCheck());
  }
  if (!!payload) {
    yield put(actions.addVisit(payload));
  }
}

function* whitelistCheckSaga() {
  const state = yield select(selectWalletProvider);
  try {
    const result = yield call([whitelist, whitelist.test], state.address);
    yield put(actions.whitelistChecked(result));
  } catch (e) {
    yield put(actions.whitelistChecked(false));
  }
}

function* callTestTransactionsState() {
  let hasChanges = false;
  const transactions = yield select(selectTransactionArray);
  const txes = transactions.filter(item => item.status === TxStatus.PENDING);
  for (let tx of txes) {
    const receipt: TransactionReceipt = yield call(
      [Sovryn, Sovryn.getWeb3().eth.getTransactionReceipt],
      tx.transactionHash,
    );
    if (receipt === null) {
      continue;
    }
    if (receipt?.status) {
      hasChanges = true;
    }
    yield put(
      txActions.updateTransactionStatus({
        transactionHash: tx.transactionHash,
        status: receipt?.status ? TxStatus.CONFIRMED : TxStatus.FAILED,
      }),
    );
  }

  if (hasChanges) {
    const block = yield call([contractReader, contractReader.blockNumber]);
    yield put(actions.reSync(block.number));
  }
}

function* testTransactionsPeriodically() {
  while (true) {
    yield call(callTestTransactionsState);
    yield delay(5000); //fetch every 5 seconds
  }
}

function* addVisitSaga({ payload }: PayloadAction<string>) {
  yield call([axios, axios.post], backendUrl[currentChainId] + '/addVisit', {
    walletAddress: payload,
  });
}

export function* walletProviderSaga() {
  yield takeLatest(actions.chainChanged.type, callCreateBlockChannels);
  yield takeLatest(actions.connected.type, walletConnected);
  yield takeLatest(actions.disconnected.type, walletDisconnected);
  yield takeLatest(actions.testTransactions.type, testTransactionsPeriodically);
  yield takeLatest(actions.accountChanged.type, accountChangedSaga);
  yield takeLatest(actions.whitelistCheck.type, whitelistCheckSaga);
  yield takeLatest(actions.addVisit.type, addVisitSaga);
  // takeEvery block.
  yield takeEvery(actions.blockReceived.type, processBlockHeader);
}
