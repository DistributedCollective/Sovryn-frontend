import { useEffect, useMemo, useState } from 'react';
import type { TransactionConfig } from 'web3-core';
import type { AbiItem } from 'web3-utils';
import { contractReader } from '../../utils/sovryn/contract-reader';
import { gas } from '../../utils/blockchain/gas-price';
import { bignumber } from 'mathjs';
import { ContractName } from '../../utils/types/contracts';
import { getContract } from '../../utils/blockchain/contract-helpers';

export function useEstimateGas(
  address: string,
  abi: AbiItem[] | AbiItem,
  methodName: string,
  args: any[],
  config: TransactionConfig = {},
  condition?: boolean,
) {
  const [state, setState] = useState({ value: 0, loading: false, error: '' });

  useEffect(() => {
    if (condition === undefined || condition) {
      setState(prevState => ({ ...prevState, loading: true, error: '' }));
      contractReader
        .estimateGas(address, abi, methodName, args, config)
        .then(result =>
          setState(prevState => ({
            ...prevState,
            value: result,
            loading: false,
            error: '',
          })),
        )
        .catch(e =>
          setState(prevState => ({
            ...prevState,
            loading: false,
            error: e.message,
          })),
        );
    }
    // eslint-disable-next-line
  }, [address, JSON.stringify(abi), methodName, JSON.stringify(args), JSON.stringify(config), condition]);

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
