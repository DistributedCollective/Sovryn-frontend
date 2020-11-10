import { put } from 'redux-saga/effects';
import { actions } from './slice';

export function* getUserSaga() {
  alert('Get User Saga');
  yield put(actions.getUser());
}
