import { eventChannel, END } from 'redux-saga';
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
import { PollingBlockTracker } from 'eth-block-tracker';
import { Sovryn } from 'utils/sovryn';
import { selectWalletProvider } from './selectors';
import { actions } from './slice';
import { selectTransactionArray } from '../../../store/global/transactions-store/selectors';
import { actions as txActions } from '../../../store/global/transactions-store/slice';
import {
  TxStatus,
  Transaction,
} from '../../../store/global/transactions-store/types';
import { whitelist } from '../../../utils/whitelist';
import delay from '@redux-saga/delay-p';
import axios from 'axios';
import { contractReader } from '../../../utils/sovryn/contract-reader';
import {
  backendUrl,
  currentChainId,
  userLogUrl,
} from '../../../utils/classifiers';
import { bridgeNetwork } from '../../pages/BridgeDepositPage/utils/bridge-network';
import { BridgeNetworkDictionary } from '../../pages/BridgeDepositPage/dictionaries/bridge-network-dictionary';
import { Chain, Nullable } from '../../../types';
import { gsnNetwork } from '../../../utils/gsn/GsnNetwork';
import { debug } from 'utils/debug';

const log = debug('WalletProvider');

// start block watcher
function createBlockPollChannel({ interval }) {
  return eventChannel(emit => {
    const web3 = Sovryn.getWeb3();
    const provider = web3.currentProvider as any;
    provider.sendAsync = provider.send;

    const blockTracker = new PollingBlockTracker({
      provider,
      pollingInterval: interval,
    });

    blockTracker.on('sync', ({ newBlock }) => {
      emit(actions.blockReceived(Number(newBlock)));
    });

    let ended = false;
    const cleanup = (afterError: boolean = false) => {
      if (!ended) {
        ended = true;

        // Restart block tracker
        blockTracker.removeAllListeners('');

        if (afterError) {
          emit(actions.connectionError());
        }

        // End this block tracker channel
        emit(END);
      }
    };

    // Restart on error or new connection
    blockTracker.on('error', () => setTimeout(() => cleanup(true), 15000));
    return cleanup;
  });
}

function* callCreateBlockPollChannel() {
  const blockChannel = yield call(createBlockPollChannel, {
    interval: 10000,
  });

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
  const blockNumber = event.payload;
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
    log.error('Error in block processing:', error);
  }
}

function* processBlock({ block, address }) {
  try {
    const user = address.toLowerCase();

    if (!block) {
      log.log('no block?');
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
    log.error('Error in block processing:', error);
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
  const transactions: Transaction[] = yield select(selectTransactionArray);
  const txes = transactions.filter(item => item.status === TxStatus.PENDING);

  for (let tx of txes) {
    try {
      let receipt: Nullable<TransactionReceipt> = yield call(
        [bridgeNetwork, bridgeNetwork.receipt],
        (tx.chainId &&
          BridgeNetworkDictionary.getByChainId(tx.chainId)?.chain) ||
          Chain.RSK,
        tx.transactionHash,
      );

      if (!receipt) {
        continue;
      }

      if (tx.chainId && tx.gsnPaymaster) {
        try {
          receipt = gsnNetwork
            .getProvider(tx.chainId, tx.gsnPaymaster)
            .translateReceipt(receipt);
        } catch (error) {
          console.error(error);
        }
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
    } catch (e) {
      log.error('failed to get receipt', e);
    }
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
  try {
    let finalPayload: { walletAddress: string; cid?: string } = {
      walletAddress: payload,
    };
    yield call(
      [axios, axios.post],
      backendUrl[currentChainId] + '/addVisit',
      finalPayload,
    );
    const ga = yield window.cookieStore.get('_ga');
    if (ga !== null) {
      finalPayload.cid = ga.value.slice(6, ga.value.length);
    }

    const queryString = new URL(window.location.href).search;
    yield call(
      [axios, axios.post],
      userLogUrl[currentChainId] + '/visit' + queryString,
      finalPayload,
    );
  } catch (error) {
    log.error('failed to log visit', error);
  }
}

export function* walletProviderSaga() {
  yield takeLatest(
    [
      actions.chainChanged.type,
      actions.connectionError.type,
      actions.sovrynNetworkReady.type,
    ],
    callCreateBlockPollChannel,
  );
  yield takeLatest(actions.connected.type, walletConnected);
  yield takeLatest(actions.disconnected.type, walletDisconnected);
  yield takeLatest(actions.testTransactions.type, testTransactionsPeriodically);
  yield takeLatest(actions.accountChanged.type, accountChangedSaga);
  yield takeLatest(actions.whitelistCheck.type, whitelistCheckSaga);
  yield takeLatest(actions.addVisit.type, addVisitSaga);
  // takeEvery block.
  yield takeEvery(actions.blockReceived.type, processBlockHeader);
}
