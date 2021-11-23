import { SimulatorResponse, TxTuple } from './types';
import { FAKE_SIMULATOR_TX_DATA } from './helpers';
import { useTenderlySimulator } from '../classifiers';

const prepareBody = (networkId: string, tx: TxTuple) =>
  JSON.stringify({
    network_id: String(networkId),
    tx,
  });

export const simulateTx = async (
  networkId: string,
  tx: TxTuple,
  signal?: AbortSignal,
): Promise<SimulatorResponse> => {
  if (!useTenderlySimulator) {
    const fakeResponse: SimulatorResponse =
      tx.length === 2
        ? [FAKE_SIMULATOR_TX_DATA, FAKE_SIMULATOR_TX_DATA]
        : [FAKE_SIMULATOR_TX_DATA];
    return Promise.resolve(fakeResponse);
  }

  return fetch(`${process.env.REACT_APP_ESTIMATOR_URI}`, {
    method: 'post',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: prepareBody(networkId, tx),
    signal,
  }).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Request failed');
  });
};
