import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './slice';
import { PayloadAction } from '@reduxjs/toolkit';
import { getRateByPath } from './requests';

export function* getSwapRate({
  payload,
}: PayloadAction<{ path: string[]; amount: string }>) {
  try {
    const rate = yield call(getRateByPath, payload.path, payload.amount);
    yield put(actions.requestRateSuccess(rate));
  } catch (e) {
    yield put(actions.requestRateSuccess('0'));
  }
}

export function* sendSwapTransaction({
  payload,
}: PayloadAction<{ path: string[]; amount: string }>) {
  try {
    const rate = yield call(getRateByPath, payload.path, payload.amount);
    console.log('rate', rate);
  } catch (e) {
    //
  }
}

export function* tokenSwapContainerSaga() {
  yield takeLatest(actions.requestRate.type, getSwapRate);
  yield takeLatest(actions.submitForm.type, sendSwapTransaction);
}
