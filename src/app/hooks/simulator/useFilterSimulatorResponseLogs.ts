import { useMemo } from 'react';
import { AbiInput } from 'web3-utils';
import { SimulatorHookResponse } from './useSimulator';
import { Nullable } from '../../../types';
import { SimulatedTx } from '../../../utils/simulator/types';
import { Sovryn } from '../../../utils/sovryn';

export enum SimulationStatus {
  NONE = 'none',
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

type LogData<T = { [key: string]: string }> = {
  raw: { address: string; data: string; topics: string[] };
  decoded: T;
};

type Response<T> = {
  status: SimulationStatus;
  gasUsed: number;
  error: Nullable<string>;
  logs: LogData<T>[];
};

export function useFilterSimulatorResponseLogs<T = Record<string, string>>(
  simulatorResponse: SimulatorHookResponse,
  topic: string,
  abiInput: AbiInput[],
  index?: 0 | 1,
): Response<T> {
  return useMemo(() => {
    if (simulatorResponse.loading) {
      return {
        status: SimulationStatus.PENDING,
        gasUsed: 0,
        error: null,
        logs: [],
      };
    }

    if (simulatorResponse.value === null) {
      return {
        status: SimulationStatus.NONE,
        gasUsed: 0,
        error: null,
        logs: [],
      };
    }

    const tx: SimulatedTx = (index === undefined
      ? simulatorResponse.value[simulatorResponse.value.length - 1]
      : simulatorResponse.value[index]) as SimulatedTx;

    let logs: LogData<T>[] = [];

    if (tx.transaction.status) {
      const items = tx.transaction.transaction_info.logs;
      if (items?.length) {
        logs = items
          .filter(item => item.raw.topics[0] === topic)
          .map(item => {
            item.raw.topics.shift();
            const decoded = (Sovryn.getWeb3().eth.abi.decodeLog(
              abiInput,
              item.raw.data,
              item.raw.topics,
            ) as unknown) as T;
            return {
              raw: item.raw,
              decoded,
            };
          });
      }
    }

    return {
      status: tx.transaction.status
        ? SimulationStatus.SUCCESS
        : SimulationStatus.FAILED,
      gasUsed: tx.transaction.gas_used,
      error: tx.transaction.error_message || null,
      logs,
    };
  }, [
    abiInput,
    index,
    simulatorResponse.loading,
    simulatorResponse.value,
    topic,
  ]);
}
