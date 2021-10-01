import { SimulatorResponse, TxTuple } from './types';
import { FAKE_SIMULATOR_TX_DATA } from './helpers';

const prepareBody = (networkId: string, tx: TxTuple) => {
  // todo: this is how body will provided to our backend service
  // const body = {
  //   network_id: String(networkId),
  //   tx,
  // };

  // todo: this is how body is provided to tenderly api directly, remove it when your backend is ready.
  const body = {
    network_id: String(networkId),
    from: tx[0].from,
    to: tx[0].to,
    input: tx[0].input,
    gas: tx[0].gas,
    gas_price: tx[0].gas_price,
    value: tx[0].value,
    simulation_type: 'quick',
  };

  return JSON.stringify(body);
};

export const simulateTx = async (
  networkId: string,
  tx: TxTuple,
  signal?: AbortSignal,
): Promise<SimulatorResponse> => {
  if (!process.env.REACT_APP_ESTIMATOR_URI) {
    const fakeResponse: SimulatorResponse =
      tx.length === 2
        ? [FAKE_SIMULATOR_TX_DATA, FAKE_SIMULATOR_TX_DATA]
        : [FAKE_SIMULATOR_TX_DATA];
    return Promise.resolve(fakeResponse);
  }

  // todo: make sure uri is correct when using our api.
  return (
    fetch(`${process.env.REACT_APP_ESTIMATOR_URI}/simulate`, {
      method: 'post',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        // todo: remove when using our api
        'x-access-key': `${process.env.REACT_APP_TENDERLY_ACCESS_TOKEN}`,
      },
      body: prepareBody(networkId, tx),
      signal,
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request failed');
      })
      // todo remove this when using our api (ours will return data correctly)
      .then(response => {
        if (tx.length === 2) return [response, response];
        return [response];
      })
  );
};
