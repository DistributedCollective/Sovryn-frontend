import { useEffect, useMemo, useState } from 'react';
import type { TransactionConfig } from 'web3-core';
import type { AbiItem } from 'web3-utils';
import { contractReader } from '../../utils/sovryn/contract-reader';
import { gas } from '../../utils/blockchain/gas-price';
import { bignumber } from 'mathjs';
import { ContractName } from '../../utils/types/contracts';
import { getContract } from '../../utils/blockchain/contract-helpers';
import { useIsMounted } from './useIsMounted';

export function useEstimateGas(
  address: string,
  abi: AbiItem[] | AbiItem,
  methodName: string,
  args: any[],
  config: TransactionConfig = {},
  condition?: boolean,
) {
  const isMounted = useIsMounted();
  const [state, setState] = useState({ value: 0, loading: false, error: '' });

  useEffect(() => {
    if (config?.gas) {
      setState({ value: Number(config.gas), loading: false, error: '' });
      return;
    }

    if (condition === undefined || condition) {
      if (isMounted()) {
        setState(prevState => ({ ...prevState, loading: true, error: '' }));
      }
      contractReader
        .estimateGas(address, abi, methodName, args, config)
        .then(result => {
          if (isMounted()) {
            setState(prevState => ({
              ...prevState,
              value: result,
              loading: false,
              error: '',
            }));
          }
        })
        .catch(e => {
          if (isMounted()) {
            setState(prevState => ({
              ...prevState,
              loading: false,
              error: e.message,
            }));
          }
        });
    }
    // eslint-disable-next-line
  }, [
    address,
    // eslint-disable-next-line
    JSON.stringify(abi),
    methodName,
    // eslint-disable-next-line
    JSON.stringify(args),
    // eslint-disable-next-line
    JSON.stringify(config),
    condition,
    isMounted,
  ]);

  const txFee = useMemo(
    () => bignumber(state.value).mul(gas.get()).toFixed(0),
    [state.value],
  );

  return {
    value: txFee,
    error: state.error,
    loading: state.loading,
    gasPrice: gas.get(),
    gasLimit: state.value,
  };
}

export function useEstimateContractGas(
  contractName: ContractName,
  methodName: string,
  args: any[],
  config: TransactionConfig = {},
  condition?: boolean,
) {
  const { address, abi } = getContract(contractName);
  return useEstimateGas(address, abi, methodName, args, config, condition);
}
