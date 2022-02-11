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

/**
 * Call contracts using the Gas Station Network, allowing you to pay transactions fees with another token!
 * Falls back to bridgeNetwork, when useGSN = false is passed to the hook.
 * @param chain chain that the target contract is deployed on
 * @param contractName
 * @param methodName
 * @param paymaster paymaster contract address
 * @param useGSN flag for enabling or disabling GSN, will use bridgeNetwork otherwise
 */
export const useGsnSendTx = (
  chain: Chain,
  contractName: ContractName,
  methodName: string,
  paymaster: string,
  useGSN: boolean = true,
): SendTxResponseInterface => {
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

  const sendCombined = useCallback(
    async (args: any[], config: TransactionConfig = {}) => {
      if (useGSN) {
        if (!gsn) {
          throw Error("GSN couldn't be initialized yet");
        }
        setTxId(TxStatus.INITIALIZING_GSN);
        if (!(await gsn.isReady)) {
          throw Error('GSN failed to initialize!');
        }
        return gsn.send(contractAddress, abi, methodName, args, config);
      } else {
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
      }
    },
    [useGSN, gsn, chain, chainId, account, contractAddress, methodName, abi],
  );

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
      return sendCombined(args, config)
        .then((result: string | { transactionHash: string }) => {
          const transactionHash =
            typeof result === 'string' ? result : result?.transactionHash;
          dispatch(
            actions.addTransaction({
              chainId,
              gsnPaymaster: useGSN ? paymaster : undefined,
              transactionHash,
              approveTransactionHash: options?.approveTransactionHash || null,
              type: options?.type || TxType.OTHER,
              status: TxStatus.PENDING,
              loading: true,
              to: contractAddress,
              from: account.toLowerCase(),
              value: config?.value?.toString() || '0',
              asset: options?.asset || null,
              assetAmount: options?.assetAmount || null,
              customData: options?.customData || undefined,
            }),
          );
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
    [
      chainId,
      sendCombined,
      account,
      contractAddress,
      dispatch,
      useGSN,
      paymaster,
    ],
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
};
