import { put, takeEvery } from 'redux-saga/effects';
import { actions as actionsPerpetual } from './slice';
import { actions as actionsWalletProvider } from '../../containers/WalletProvider/slice';
import { PayloadAction } from '@reduxjs/toolkit';

function* watchUseMetaTransactions({ payload }: PayloadAction<boolean>) {
  yield put(actionsWalletProvider.setSignTypedRequired(payload));
}

export function* perpetualPageSaga() {
  yield takeEvery(
    actionsPerpetual.setUseMetaTransactions.type,
    watchUseMetaTransactions,
  );
}
