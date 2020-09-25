import { call, put } from 'redux-saga/effects';
import * as Action from '@drizzle/store/src/web3/constants';
import { Sovryn } from '../../../utils/sovryn';

/*
 * Initialization
 */

export function* initializeWeb3(options) {
  console.log('export function* initializeWeb3(options) {');
  try {
    const web3 = Sovryn.getWeb3();
    const writeWeb3 = Sovryn.getWriteWeb3();
    yield put({ type: Action.WEB3_INITIALIZED });
    return {
      web3,
      writeWeb3,
    };
  } catch (error) {
    yield put({ type: Action.WEB3_FAILED, error });
  }
}

/*
 * Network ID
 */

export function* getNetworkId({ web3 }) {
  try {
    const networkId = yield call(web3.eth.net.getId);

    yield put({ type: Action.NETWORK_ID_FETCHED, networkId });

    return networkId;
  } catch (error) {
    yield put({ type: Action.NETWORK_ID_FAILED, error });

    console.error('Error fetching network ID:');
    console.error(error);
  }
}
