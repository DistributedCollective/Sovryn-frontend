import { useCallback, useEffect, useState } from 'react';
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
import { contractWriter } from 'utils/sovryn/contract-writer';
import { useAccount } from './useAccount';
import { gasLimit } from '../../utils/classifiers';
import {
  SendTxResponseInterface,
  TransactionOptions,
} from './useSendContractTx';
import { selectWalletProvider } from '../containers/WalletProvider/selectors';

export function useSendToContractAddressTx(
  address: string,
  abi: AbiItem[],
  methodName: string,
): SendTxResponseInterface {
  const transactions = useSelector(selectTransactions);
  const loading = useSelector(selectLoadingTransaction);
  const { chainId } = useSelector(selectWalletProvider);
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
        options.approveTransactionHash &&
        options.type &&
        gasLimit.hasOwnProperty(options.type)
      ) {
        config.gas = gasLimit[options.type];
      }
      return contractWriter
        .sendByAddress(address, abi, methodName, args, config)
        .then(e => {
          const transactionHash = e as string;
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
              chainId,
            }),
          );
          setTxId(transactionHash);
          dispatch(actions.closeTransactionRequestDialog());
          return true;
        })
        .catch(e => {
          console.error(e.message);
          setTxId(TxStatus.FAILED);
          dispatch(actions.setTransactionRequestDialogError(e.message));
          return false;
        });
    },
    [account, address, abi, methodName, chainId, dispatch],
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
