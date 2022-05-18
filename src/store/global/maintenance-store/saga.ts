import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import delay from '@redux-saga/delay-p';
import { actions } from './slice';
import { maintenanceUrl, currentChainId } from 'utils/classifiers';

function fetchState() {
  return axios
    .get(maintenanceUrl[currentChainId] + '/maintenance')
    .then(response => ({ response }))
    .catch(error => ({ error }));
}

function* callFetchMaintenanceState() {
  const { response, error } = yield call(fetchState);
  if (response && response.data)
    yield put(actions.maintenanceSuccess(response.data));
  else if (error) yield put(actions.maintenanceFail({ error }));
}

function* fetchMaintenanceStatePeriodically() {
  while (true) {
    yield call(callFetchMaintenanceState);
    yield delay(60000); //fetch every minute
  }
}

export function* maintenanceStateSaga() {
  if (!process.env.REACT_APP_BYPASS_MAINTENANCE) {
    yield takeLatest(
      actions.fetchMaintenance.type,
      fetchMaintenanceStatePeriodically,
    );
  }
}
