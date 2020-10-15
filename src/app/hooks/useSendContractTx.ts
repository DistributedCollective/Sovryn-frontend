import { useEffect, useState } from 'react';
import { TransactionStatus } from '../../types/transaction-status';
import { Sovryn } from '../../utils/sovryn';

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
  const [tx, setTx] = useState<string>(null as any);
  const [status, setStatus] = useState<TransactionStatus>(
    TransactionStatus.NONE,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval;
    if (tx && status === TransactionStatus.PENDING) {
      interval = setInterval(() => {
        Sovryn.getWeb3()
          .eth.getTransactionReceipt(tx)
          .then(receipt => {
            if (receipt !== null) {
              setStatus(
                receipt.status
                  ? TransactionStatus.SUCCESS
                  : TransactionStatus.ERROR,
              );
              setLoading(false);
            }
          })
          .catch(() => {
            setStatus(TransactionStatus.ERROR);
            setLoading(false);
          });
      }, 5000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [tx, status]);

  return {
    send: (...args) => {
      setLoading(true);
      setStatus(TransactionStatus.PENDING_FOR_USER);
      Sovryn.callContract(contractName, methodName, ...args)
        .then(e => {
          setTx(e);
          setStatus(TransactionStatus.PENDING);
        })
        .catch(e => {
          setStatus(TransactionStatus.ERROR);
          setLoading(false);
          console.error(e);
        });
    },
    txHash: tx,
    txData: null,
    status,
    loading,
  };
}
