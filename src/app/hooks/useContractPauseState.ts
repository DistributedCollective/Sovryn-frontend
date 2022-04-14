import { useEffect, useState } from 'react';
import { Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { ContractName } from 'utils/types/contracts';
import { useIsMounted } from './useIsMounted';

export enum ContractPauseState {
  NONE,
  PAUSED,
  FROZEN,
}

type ContractPauseStateValue = {
  state: ContractPauseState;
  loading: boolean;
  error?: Error;
};

export const useContractPauseState = (contractName: ContractName) => {
  const isMounted = useIsMounted();
  const [state, setState] = useState<ContractPauseStateValue>({
    state: ContractPauseState.NONE,
    loading: true,
  });

  useEffect(() => {
    setState(prevState => ({ ...prevState, loading: true, error: undefined }));
    const { address, abi } = getContract(contractName);
    bridgeNetwork
      .multiCall(Chain.RSK, [
        {
          key: 'frozen',
          address,
          abi,
          fnName: 'frozen',
          args: [],
          parser: result => result[0],
        },
        {
          key: 'paused',
          address,
          abi,
          fnName: 'paused',
          args: [],
          parser: result => result[0],
        },
      ])
      .then(({ returnData }) => {
        if (isMounted()) {
          let status = ContractPauseState.NONE;
          if (returnData.paused) {
            status = ContractPauseState.PAUSED;
          }
          // frozen also includes paused, so overwriting
          if (returnData.frozen) {
            status = ContractPauseState.FROZEN;
          }

          setState({ state: status, loading: false });
        }
      })
      .catch(error => {
        console.error('useContractPauseState failed.', error);
        if (isMounted()) {
          setState({ state: ContractPauseState.NONE, loading: false, error });
        }
      });
  }, [contractName, isMounted]);

  return {
    ...state,
    paused: [ContractPauseState.PAUSED, ContractPauseState.FROZEN].includes(
      state.state,
    ),
    frozen: state.state === ContractPauseState.FROZEN,
  };
};
