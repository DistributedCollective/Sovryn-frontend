import { useCallback, useEffect, useState, useRef } from 'react';
import { TransactionConfig } from 'web3-core';
import { useDispatch, useSelector } from 'react-redux';
import { AbiItem } from 'web3-utils';
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
import { useAccount } from './useAccount';
import { gasLimit } from '../../utils/classifiers';
import {
  SendTxResponseInterface,
  TransactionOptions,
} from './useSendContractTx';
import { ChainId } from 'types';
import { GsnWrapper } from 'utils/gsn/GsnWrapper';

export function useSendToGsnContractAddressTx(
  chainId: ChainId,
  paymaster: string,
  address: string,
  abi: AbiItem[],
  methodName: string,
): SendTxResponseInterface {
  const gsn = useRef<GsnWrapper>();

  useEffect(() => {
    gsn.current = new GsnWrapper(chainId, paymaster);
  }, [chainId, paymaster]);

  const transactions = useSelector(selectTransactions);
  const loading = useSelector(selectLoadingTransaction);
  const dispatch = useDispatch();
  const account = useAccount();
  const [txId, setTxId] = useState<string | TxStatus>(TxStatus.NONE);
  const [tx, setTx] = useState<Transaction>();

  const send = useCallback(
    (
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
      gsn.current
        ?.send(address, abi, methodName, args, config)
        .then(e => {
          console.log(e);
          const transactionHash = e.hash as string;
          dispatch(
            actions.addTransaction({
              transactionHash: transactionHash,
              approveTransactionHash: options?.approveTransactionHash || null,
              type: options?.type || TxType.OTHER,
              status: TxStatus.PENDING,
              loading: true,
              to: address,
              from: account,
              value: (config?.value as string) || '0',
              asset: options?.asset || null,
              assetAmount: options?.assetAmount || null,
            }),
          );
          setTxId(transactionHash);
          dispatch(actions.closeTransactionRequestDialog());
        })
        .catch(e => {
          console.error(e.message);
          setTxId(TxStatus.FAILED);
          dispatch(actions.setTransactionRequestDialogError(e.message));
        });
    },
    [account, address, abi, methodName, dispatch],
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
    status: tx ? tx.status : txId,
    loading: loading,
  };
}
