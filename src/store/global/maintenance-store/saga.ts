import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './slice';
import { backendUrl, currentChainId } from 'utils/classifiers';

function fetchState() {
  return axios
    .get(backendUrl[currentChainId] + '/getMaintenance')
    .then(response => ({ response }))
    .catch(error => ({ error }));
}

function* callCreateMaintenanceState() {
  const { response, error } = yield call(fetchState);
  if (response && response.data)
    yield put(actions.maintenanceSuccess(response.data));
  else if (error) yield put(actions.maintenanceFail({ error }));
}

export function* maintenanceStateSaga() {
  yield takeLatest(
    actions.fetchMaintenanceState.type,
    callCreateMaintenanceState,
  );
}
