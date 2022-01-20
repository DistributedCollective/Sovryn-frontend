import { useCallback, useEffect, useState, useMemo } from 'react';
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
  SendTxResponseInterface,
  TransactionOptions,
} from './useSendContractTx';
import { Chain } from 'types';
import { gsnNetwork } from '../../utils/gsn/GsnNetwork';
import { bridgeNetwork } from '../pages/BridgeDepositPage/utils/bridge-network';
import { BridgeNetworkDictionary } from '../pages/BridgeDepositPage/dictionaries/bridge-network-dictionary';
import { getContract } from '../../utils/blockchain/contract-helpers';
import { ContractName } from '../../utils/types/contracts';

export function useGsnSendTx(
  chain: Chain,
  contractName: ContractName,
  methodName: string,
  paymaster: string,
  useGSN: boolean = true,
): SendTxResponseInterface {
  const transactions = useSelector(selectTransactions);
  const loading = useSelector(selectLoadingTransaction);
  const dispatch = useDispatch();
  const account = useAccount();
  const [txId, setTxId] = useState<string | TxStatus>(TxStatus.NONE);
  const [tx, setTx] = useState<Transaction>();

  const chainId = useMemo(() => BridgeNetworkDictionary.get(chain)?.chainId, [
    chain,
  ]);

  const { address: contractAddress, abi } = useMemo(
    () => getContract(contractName),
    [contractName],
  );

  const gsn = useMemo(
    () => chainId && gsnNetwork.getProvider(chainId, paymaster),
    [chainId, paymaster],
  );

  const sendCombined = useMemo(() => {
    if (useGSN) {
      return async (args: any[], config: TransactionConfig = {}) => {
        if (!gsn) {
          throw Error("GSN couldn't be initialized yet");
        }
        if (!gsn.isReady) {
          setTxId(TxStatus.INITIALIZING_GSN);
          await gsn.isReady;
        }
        return gsn.send(contractAddress, abi, methodName, args, config);
      };
    } else {
      return (args: any[], config: TransactionConfig = {}) => {
        const data = bridgeNetwork.encodeFunctionData(
          chain,
          contractAddress,
          abi,
          methodName,
          args,
        );
        return bridgeNetwork.send(chain, {
          chainId,
          from: account,
          to: contractAddress,
          data: data,
          value: config.value?.toString(),
          gasLimit: config.gas,
          gasPrice: config.gasPrice?.toString(),
          nonce: config.nonce,
        });
      };
    }
  }, [useGSN, gsn, chain, chainId, account, contractAddress, methodName, abi]);

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
      sendCombined(args, config)
        .then((result: string | { transactionHash: string }) => {
          const transactionHash =
            typeof result === 'string' ? result : result?.transactionHash;
          dispatch(
            actions.addTransaction({
              chainId,
              transactionHash,
              approveTransactionHash: options?.approveTransactionHash || null,
              type: options?.type || TxType.OTHER,
              status: TxStatus.PENDING,
              loading: true,
              to: contractAddress,
              from: account,
              value: config?.value?.toString() || '0',
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
    [chainId, sendCombined, account, contractAddress, dispatch],
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
