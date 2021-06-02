import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './slice';
import { actions as walletProviderActions } from 'app/containers/WalletProvider/slice';

export function* selectNetwork(data) {
  yield put(walletProviderActions.setBridgeChainId(data.payload.chainId));
  const context = data.payload.walletContext;
  yield call([context, context.connect]);
  console.log(data, context);
}

export function* bridgeDepositPageSaga() {
  yield takeLatest(actions.selectNetwork.type, selectNetwork);
}
