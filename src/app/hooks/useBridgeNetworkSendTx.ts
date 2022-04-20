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
import { ContractName } from 'utils/types/contracts';
import { useAccount } from './useAccount';
import { Chain, Nullable } from 'types';
import { gasLimit } from '../../utils/classifiers';
import { bridgeNetwork } from '../pages/BridgeDepositPage/utils/bridge-network';
import { getContract } from '../../utils/blockchain/contract-helpers';
import { BridgeNetworkDictionary } from '../pages/BridgeDepositPage/dictionaries/bridge-network-dictionary';
import {
  SendTxResponseInterface,
  TransactionOptions,
} from './useSendContractTx';

export function useBridgeNetworkSendTx(
  chain: Chain,
  contractName: ContractName,
  methodName: string,
): SendTxResponseInterface {
  const transactions = useSelector(selectTransactions);
  const loading = useSelector(selectLoadingTransaction);
  const dispatch = useDispatch();
  const account = useAccount();
  const [txId, setTxId] = useState<string | TxStatus>(TxStatus.NONE);
  const [tx, setTx] = useState<Nullable<Transaction>>(null);

  const send = useCallback(
    (
      args: any[],
      config: TransactionConfig = {},
      options: TransactionOptions = {},
    ) => {
      const chainId = BridgeNetworkDictionary.get(chain)?.chainId;
      const { address: contractAddress, abi } = getContract(contractName);
      const data = bridgeNetwork.encodeFunctionData(
        chain,
        contractAddress,
        abi,
        methodName,
        args,
      );

      setTxId(TxStatus.PENDING_FOR_USER);
      if (
        !config.hasOwnProperty('gas') &&
        options.approveTransactionHash &&
        options.type &&
        gasLimit.hasOwnProperty(options.type)
      ) {
        config.gas = gasLimit[options.type];
      }

      return bridgeNetwork
        .send(chain, {
          chainId,
          data,
          to: contractAddress,
          gasLimit: config.gas,
          gasPrice: config.gasPrice && String(config.gasPrice),
          value: config.value && String(config.value),
          nonce: config.nonce,
        })
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
            value: config?.value?.toString() || '0',
            asset: options?.asset || null,
            assetAmount: options?.assetAmount || null,
            customData: options?.customData || undefined,
            chainId,
          };
          dispatch(actions.addTransaction(txData));
          setTx(txData);
          setTxId(transactionHash);
          dispatch(actions.closeTransactionRequestDialog());
          return transactionHash;
        })
        .catch(e => {
          console.error(e.message);
          setTxId(TxStatus.FAILED);
          dispatch(actions.setTransactionRequestDialogError(e.message));
        });
    },
    [chain, account, contractName, methodName, dispatch],
  );

  const reset = useCallback(() => {
    setTxId(TxStatus.NONE);
    setTx(null);
  }, []);

  useEffect(() => {
    if (txId && transactions.hasOwnProperty(txId)) {
      setTx(transactions[txId]);
    } else {
      setTx(null);
    }
  }, [txId, transactions]);

  return {
    send,
    reset,
    txData: tx,
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
