import { useEffect, useState } from 'react';
import { drizzleReactHooks } from '@drizzle/react-plugin';
import { useDrizzle } from './useDrizzle';
import { TransactionStatus } from '../../types/transaction-status';

export interface SendTxResponseInterface {
  send: (...args: any) => void;
  txHash: string;
  txData: any;
  status: TransactionStatus;
  loading: boolean;
}

export function useSendContractTx(
  contractName: string,
  methodName: string,
): SendTxResponseInterface {
  const drizzle = useDrizzle();
  const { transactionStack, transactions } = drizzleReactHooks.useDrizzleState(
    drizzleState => ({
      transactionStack: drizzleState.transactionStack,
      transactions: drizzleState.transactions,
    }),
  );
  const [stackID, setStackID] = useState<number>(null as any);

  const [response, setResponse] = useState<any>(null);
  const [tx, setTx] = useState<string>(null as any);
  const [status, setStatus] = useState<TransactionStatus>(
    TransactionStatus.NONE,
  );
  const [loading, setLoading] = useState(false);
  const [temp, setTemp] = useState<string>(null as any);

  const contractMethod = drizzle?.contracts[contractName]?.methods[methodName];

  useEffect(() => {
    let txHash = transactionStack[stackID] || null;
    if (!txHash) {
      setStatus(TransactionStatus.NONE);
      setTx(null as any);
      setLoading(false);
      setResponse(null);
    } else {
      let txData = transactions[txHash] || null;
      if (txHash && txHash.startsWith('TEMP_')) {
        setTemp(txHash);
        txHash = null;
        if (!txData) {
          setStatus(TransactionStatus.PENDING_FOR_USER);
          setLoading(true);
        } else {
          setStatus(txData.status);
          setLoading(txData.status === 'pending');
        }
      } else {
        const tempData = transactions[temp] || null;
        if (tempData) {
          txData = tempData;
        }
        setStatus(txData.status);
        setLoading(txData.status === 'pending');
      }
      setResponse(txData);
      setTx(txHash);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stackID, transactionStack, transactions]);

  return {
    send: (...args) => setStackID(contractMethod?.cacheSend(...args)),
    txHash: tx,
    txData: response,
    status,
    loading,
  };
}
