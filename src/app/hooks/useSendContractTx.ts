import { useCallback, useEffect, useState } from 'react';
import { TransactionConfig } from 'web3-core';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectLoadingTransaction,
  selectTransactions,
} from 'store/global/transactions-store/selectors';
import {
  Transaction,
  TxStatus,
  TxType,
} from 'store/global/transactions-store/types';
import { actions } from 'store/global/transactions-store/slice';
import { Asset } from 'types/asset';
import { contractWriter } from 'utils/sovryn/contract-writer';
import { ContractName } from 'utils/types/contracts';
import { useAccount } from './useAccount';
import { Nullable } from 'types';
import { gasLimit } from '../../utils/classifiers';

export interface TransactionOptions {
  type?: TxType;
  approveTransactionHash?: Nullable<string>;
  asset?: Asset;
  assetAmount?: string;
  customData?: { [key: string]: any };
}

export interface SendTxResponse {
  txHash: string;
  txData: Nullable<Transaction>;
  status: TxStatus | any;
  loading: boolean;
}

export interface ResetTxResponseInterface extends SendTxResponse {
  reset: () => void;
}

export interface SendTxResponseInterface extends ResetTxResponseInterface {
  send: (
    args: any[],
    config?: TransactionConfig,
    options?: TransactionOptions,
  ) => void;
}

export function useSendContractTx(
  contractName: ContractName,
  methodName: string,
): SendTxResponseInterface {
  const transactions = useSelector(selectTransactions);
  const loading = useSelector(selectLoadingTransaction);
  const dispatch = useDispatch();
  const account = useAccount();
  const [txId, setTxId] = useState<string | TxStatus>(TxStatus.NONE);
  const [tx, setTx] = useState<Transaction>();

  const send = useCallback(
    async (
      args: any[],
      config: TransactionConfig = {},
      options: TransactionOptions = {},
    ) => {
      setTxId(TxStatus.PENDING_FOR_USER);
      if (
        !config.hasOwnProperty('gas') &&
        options.approveTransactionHash &&
        options.type &&
        gasLimit.hasOwnProperty(options.type)
      ) {
        config.gas = gasLimit[options.type];
      }

      await contractWriter
        .send(contractName, methodName, args, config)
        .then(e => {
          const transactionHash = e as string;
          const txData = {
            transactionHash: transactionHash,
            approveTransactionHash: options?.approveTransactionHash || null,
            type: options?.type || TxType.OTHER,
            status: TxStatus.PENDING,
            loading: true,
            to: contractName,
            from: account.toLowerCase(),
            value: (config?.value as string) || '0',
            asset: options?.asset || null,
            assetAmount: options?.assetAmount || null,
            customData: options?.customData || undefined,
          };
          dispatch(actions.addTransaction(txData));
          setTx(txData);
          setTxId(transactionHash);
          dispatch(actions.closeTransactionRequestDialog());
        })
        .catch(e => {
          console.error(e.message);
          setTxId(TxStatus.FAILED);
          dispatch(actions.setTransactionRequestDialogError(e.message));
        });
    },
    [account, contractName, methodName, dispatch],
  );

  const reset = useCallback(() => {
    setTxId(TxStatus.NONE);
  }, []);

  useEffect(() => {
    if (txId && transactions.hasOwnProperty(txId)) {
      setTx(transactions[txId]);
    } else {
      setTx(undefined);
    }
  }, [txId, transactions]);

  return {
    send,
    reset,
    txData: tx || null,
    txHash: tx?.transactionHash || '',
    status: tx
      ? tx.status
      : txId &&
        [
          TxStatus.NONE,
          TxStatus.PENDING_FOR_USER,
          TxStatus.PENDING_FOR_USER,
          TxStatus.CONFIRMED,
          TxStatus.FAILED,
        ].includes(txId as TxStatus)
      ? txId
      : TxStatus.PENDING,
    loading: loading,
  };
}
