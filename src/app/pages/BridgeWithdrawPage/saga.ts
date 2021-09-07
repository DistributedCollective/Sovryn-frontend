// TODO: Almost everything is same as in deposit page - remove duplicates, reuse functions.

import {
  call,
  cancel,
  cancelled,
  fork,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';
import delay from '@redux-saga/delay-p';
import { bignumber } from 'mathjs';
import { ethers } from 'ethers';
import { walletService } from '@sovryn/react-wallet';
import { debug } from '@sovryn/common';
import { eventChannel } from 'redux-saga';
import { BridgeWithdrawPageState, WithdrawStep } from './types';
import { actions } from './slice';
import { selectBridgeWithdrawPage } from './selectors';
import { Chain } from '../../../types';
import { BridgeModel } from '../BridgeDepositPage/types/bridge-model';
import { AssetModel } from '../BridgeDepositPage/types/asset-model';
import {
  getBridgeChain,
  getSupportedBridgeChainIds,
} from '../BridgeDepositPage/utils/helpers';
import { bridgeNetwork } from '../BridgeDepositPage/utils/bridge-network';
import { BridgeDictionary } from '../BridgeDepositPage/dictionaries/bridge-dictionary';
import { TxStep } from '../BridgeDepositPage/types';
import { TxType } from 'store/global/transactions-store/types';
import { gasLimit } from 'utils/classifiers';

const { log } = debug('bridge.withdraw/saga.ts');

function getSpenderAddress(
  chain: Chain,
  bridge: BridgeModel,
  asset: AssetModel,
) {
  if (chain === Chain.RSK && asset.usesAggregator) {
    return asset.aggregatorContractAddress;
  }

  if (bridge) {
    return bridge.bridgeContractAddress;
  }

  return undefined;
}

function* watchWalletChannel() {
  const blockChannel = yield call(createWalletChannel);
  try {
    while (true) {
      const event = yield take(blockChannel);
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
          emit(actions.setStep(WithdrawStep.CHAIN_SELECTOR));
        } else if (getBridgeChain(walletService.chainId) === Chain.RSK) {
          log('connected to rsk network');
          emit(actions.setStep(WithdrawStep.CHAIN_SELECTOR));
        } else if (
          !getSupportedBridgeChainIds().includes(walletService.chainId)
        ) {
          log('unsupported bridge id', walletService.chainId);
          emit(actions.setStep(WithdrawStep.CHAIN_SELECTOR));
        } else {
          log('connected to new chain');
          emit(actions.setStep(WithdrawStep.TOKEN_SELECTOR));
        }
      } catch (e) {
        console.error(e);
        emit(actions.setStep(WithdrawStep.CHAIN_SELECTOR));
      }
    };
    events.on('connected', connectedFn);
    return () => {
      events.off('connected', connectedFn);
    };
  });
}

// Start transfer sagas
function* watchTransferSaga() {
  const task = yield fork(submitTransferSaga);
  yield take(actions.closeTransfer.type);
  yield cancel(task);
}

function* approveTransfer() {
  while (true) {
    yield take(actions.approveTokens.type);
    const payload = yield select(selectBridgeWithdrawPage);

    const nonce = yield call(
      [bridgeNetwork, bridgeNetwork.nonce],
      payload.chain,
    );

    const bridge = BridgeDictionary.get(
      payload.chain as any,
      payload.targetChain,
    ) as BridgeModel;
    const asset = bridge.getAsset(payload.sourceAsset as any) as AssetModel;

    try {
      const data = bridgeNetwork.approveData(
        payload.chain,
        asset,
        getSpenderAddress(payload.chain as any, bridge, asset) ||
          bridge.bridgeContractAddress,
        payload.amount,
      );
      const approveHash = yield call(
        [bridgeNetwork, bridgeNetwork.send],
        payload.chain,
        {
          to: asset.tokenContractAddress,
          nonce,
          data,
        },
      );

      yield put(actions.confirmTransfer({ approveHash, nonce: nonce + 1 }));
    } catch (e) {
      console.error(e);
      yield put(actions.forceTransferState(TxStep.USER_DENIED));
    }
  }
}

function* confirmTransfer() {
  while (true) {
    const { payload: state } = yield take(actions.confirmTransfer.type);
    const payload = yield select(selectBridgeWithdrawPage);

    let nonce = state?.nonce;

    try {
      const bridge = BridgeDictionary.get(
        payload.chain as any,
        payload.targetChain,
      ) as BridgeModel;
      const asset = bridge.getAsset(payload.sourceAsset as any) as AssetModel;

      const receiverAddress = (
        payload.receiver || walletService.address
      ).toLowerCase();

      let to = bridge.bridgeContractAddress;
      let txData;
      let nativeValue = '0';

      // For withdrawals from RSK chain to another chain
      if (
        payload.chain === Chain.RSK &&
        payload.targetChain !== Chain.RSK &&
        asset.usesAggregator
      ) {
        // Set tx receiver as aggregator contract address
        to = asset.aggregatorContractAddress as string;
        const bAsset = (
          asset.bridgeTokenAddresses.get(payload.targetAsset) ||
          asset.bridgeTokenAddress
        ).toLowerCase();

        txData = bridgeNetwork.redeemToBridgeData(
          bridge.chain,
          to,
          bAsset,
          payload.amount,
          receiverAddress,
        );
      } else if (
        payload.chain === Chain.RSK &&
        payload.targetChain === Chain.RSK
      ) {
        // todo converting rUSDT to XUSD for example.
        console.error('Converting asset inside RSK chain not supported.');
      } else {
        let receiver = receiverAddress;
        let extraData: string | undefined = undefined;
        to = bridge.bridgeContractAddress;

        if (payload.targetChain === Chain.RSK && asset.usesAggregator) {
          receiver = asset.aggregatorContractAddress;
          extraData = ethers.utils.defaultAbiCoder.encode(
            ['address'],
            [receiverAddress],
          );
        }

        if (asset.isNative) {
          nativeValue = payload.amount;
          txData = bridgeNetwork.receiveEthAtData(
            bridge.chain,
            to,
            receiver,
            extraData || '0x',
          );
        } else {
          txData = bridgeNetwork.receiveTokensAtData(
            bridge.chain,
            to,
            asset.bridgeTokenAddress,
            payload.amount,
            receiver,
            extraData || '0x',
          );
        }
      }

      const transferHash = yield call(
        [bridgeNetwork, bridgeNetwork.send],
        payload.chain,
        {
          to,
          nonce,
          data: txData,
          value: nativeValue,
          gasLimit:
            nonce !== undefined
              ? gasLimit[TxType.CROSS_CHAIN_WITHDRAW]
              : undefined,
        },
      );

      yield put(actions.pendingTransfer(transferHash));
    } catch (e) {
      yield put(actions.forceTransferState(TxStep.USER_DENIED));
    }
  }
}

function* confirmedTransfer() {}

function* pendingTransfer() {
  while (true) {
    yield take(actions.pendingTransfer.type);
    yield call(watchPendingTransaction);
  }
}

function* failedTransfer() {}

function* submitTransferSaga() {
  const payload: BridgeWithdrawPageState = yield select(
    selectBridgeWithdrawPage,
  );
  try {
    yield fork(approveTransfer);
    yield fork(confirmTransfer);
    yield fork(pendingTransfer);
    yield fork(confirmedTransfer);
    yield fork(failedTransfer);

    const bridge = BridgeDictionary.get(
      payload.chain as any,
      payload.targetChain as any,
    ) as BridgeModel;
    const asset = bridge.getAsset(payload.sourceAsset as any) as AssetModel;

    if (asset.isNative) {
      yield put(actions.setStep(WithdrawStep.CONFIRM));
      yield put(actions.confirmTransfer({}));
      return;
    }

    const allowance = yield call(
      [bridgeNetwork, bridgeNetwork.allowance],
      payload.chain as any,
      asset,
      getSpenderAddress(payload.chain as any, bridge, asset) ||
        bridge.bridgeContractAddress,
    );

    yield put(actions.setStep(WithdrawStep.CONFIRM));

    if (bignumber(allowance).lessThan(payload.amount)) {
      yield put(actions.approveTokens());
    } else {
      yield put(actions.confirmTransfer({}));
    }
  } finally {
    if (yield cancelled()) {
      yield put(actions.closeTransfer());
    }
  }
}

function* watchPendingTransaction() {
  let check = true;
  while (check) {
    try {
      const { chain, tx } = yield select(selectBridgeWithdrawPage);
      const state = yield call(
        [bridgeNetwork, bridgeNetwork.receipt],
        chain,
        tx.hash,
      );
      if (state && state.status) {
        yield put(actions.confirmedTransfer());
        check = false;
      } else if (state && !state.status) {
        yield put(actions.failedTransfer());
        check = false;
      } else {
        yield delay(5000);
      }
    } catch (e) {
      yield put(actions.failedTransfer());
      check = false;
    }
  }
}

// End transfer sagas

function* mainChannel() {
  while (yield take(actions.init.type)) {
    const task = yield fork(watchWalletChannel);
    yield take(actions.close.type);
    yield cancel(task);
  }
}

export function* bridgeWithdrawPageSaga() {
  yield fork(mainChannel);
  yield takeLatest(actions.submitForm.type, watchTransferSaga);
}
