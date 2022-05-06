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
import { useAccount } from './useAccount';
import { gasLimit } from '../../utils/classifiers';
import {
  ResetTxResponseInterface,
  TransactionOptions,
} from './useSendContractTx';
import { walletService } from '@sovryn/react-wallet';
import { isWeb3Wallet, ProviderType } from '@sovryn/wallet';
import { Sovryn } from 'utils/sovryn';

export interface IRawTransactionData {
  to?: string;
  data?: string;
  chainId?: number;
  value: string;
  gasPrice: string;
  gasLimit: string;
  nonce: number;
}

export interface SendTxResponseInterface extends ResetTxResponseInterface {
  send: (config: TransactionConfig, options?: TransactionOptions) => void;
}

export const useSendTx = (): SendTxResponseInterface => {
  const transactions = useSelector(selectTransactions);
  const loading = useSelector(selectLoadingTransaction);
  const dispatch = useDispatch();
  const account = useAccount();
  const [txId, setTxId] = useState<string>(TxStatus.NONE);
  const [tx, setTx] = useState<Transaction>();

  const send = useCallback(
    (transaction: TransactionConfig = {}, options: TransactionOptions = {}) => {
      setTxId(TxStatus.PENDING_FOR_USER);

      if (
        !transaction.hasOwnProperty('gas') &&
        options.approveTransactionHash &&
        options.type &&
        gasLimit.hasOwnProperty(options.type)
      ) {
        transaction.gas = gasLimit[options.type];
      }

      walletService
        .signTransaction({
          to: transaction.to,
          value: String(transaction.value || '0'),
          data: transaction.data,
          gasPrice: String(transaction.gasPrice),
          nonce: Number(transaction.nonce),
          gasLimit: String(transaction.gas),
          chainId: transaction.chainId,
        })
        .then(signedTxOrTransactionHash => {
          // Browser wallets (extensions) signs and broadcasts transactions themselves
          if (isWeb3Wallet(walletService.providerType as ProviderType)) {
            return signedTxOrTransactionHash;
          } else {
            // Broadcast signed transaction and retrieve txHash.
            return new Promise((resolve, reject) => {
              Sovryn.getWeb3()
                .eth.sendSignedTransaction(signedTxOrTransactionHash)
                .once('transactionHash', tx => resolve(tx))
                .catch(e => reject(e));
            });
          }
        })
        .then(e => {
          const transactionHash = e as string;
          const txData = {
            transactionHash: transactionHash,
            approveTransactionHash: options?.approveTransactionHash || null,
            type: options?.type || TxType.OTHER,
            status: TxStatus.PENDING,
            loading: true,
            to: transaction.to as string,
            from: account.toLowerCase(),
            value: (transaction?.value as string) || '0',
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
    [account, dispatch],
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
};
