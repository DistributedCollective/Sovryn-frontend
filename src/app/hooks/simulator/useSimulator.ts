import { useEffect, useState } from 'react';
import { Nullable, Asset } from '../../../types';
import { ContractName } from '../../../utils/types/contracts';
import { Sovryn } from '../../../utils/sovryn';
import { simulateTx } from '../../../utils/simulator/simulateTx';
import { currentChainId, gasLimit } from '../../../utils/classifiers';
import {
  getContract,
  getTokenContract,
  getTokenContractName,
} from '../../../utils/blockchain/contract-helpers';
import { useAccount } from '../useAccount';
import {
  SimulatorResponse,
  TxData,
  TxTuple,
} from '../../../utils/simulator/types';
import { TxType } from '../../../store/global/transactions-store/types';

export type SimulatorHookResponse = {
  loading: boolean;
  value: Nullable<SimulatorResponse>;
  error: Nullable<string>;
};

type ApproveTx = {
  asset: Asset;
  spender: string;
  amount: string;
};

export function useSimulator(
  to: ContractName,
  method: string,
  args: any[],
  value: string = '0',
  condition?: boolean,
  approveTx?: ApproveTx,
): SimulatorHookResponse {
  const account = useAccount();
  const [state, setState] = useState<SimulatorHookResponse>({
    loading: false,
    value: null,
    error: null,
  });

  useEffect(() => {
    // If condition is defined, it must be truthy
    if (condition !== undefined && !condition) return;

    setState(prevState => ({ ...prevState, loading: true }));

    const mainSimulation: TxData = {
      to: getContract(to).address,
      from: account,
      input: Sovryn.contracts[to].methods[method](...args).encodeABI(),
      gas: gasLimit[TxType.SIMULATOR_REQUEST],
      gas_price: '0',
      value,
    };

    let tx: TxTuple = [mainSimulation];

    if (approveTx) {
      const approveSimulation: TxData = {
        to: getTokenContract(approveTx.asset).address,
        from: account,
        input: Sovryn.contracts[getTokenContractName(approveTx.asset)].methods
          .approve(approveTx.spender, approveTx.amount)
          .encodeABI(),
        gas: gasLimit[TxType.SIMULATOR_REQUEST],
        gas_price: '0',
        value: '0',
      };

      tx = [approveSimulation, mainSimulation];
    }

    const controller = new AbortController();

    simulateTx(currentChainId, tx, controller.signal)
      .then(result => {
        setState(prevState => ({
          ...prevState,
          loading: false,
          value: result,
          error: null,
        }));
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          setState(prevState => ({
            ...prevState,
            loading: false,
            value: null,
            error,
          }));
        }
      });

    return () => {
      if (controller) {
        controller.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    to,
    method,
    value,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(args),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(approveTx),
    account,
    condition,
  ]);

  return state;
}
