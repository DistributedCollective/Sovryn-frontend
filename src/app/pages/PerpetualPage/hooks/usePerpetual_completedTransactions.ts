import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectTransactions } from '../../../../store/global/transactions-store/selectors';
import {
  TxType,
  TxStatus,
  Transactions,
} from '../../../../store/global/transactions-store/types';
import { Asset } from '../../../../types';

export const usePerpetual_completedTransactions = () => {
  const [completedTransactions, setCompletedTransactions] = useState<
    Transactions
  >({});
  const transactions = useSelector(selectTransactions);

  useEffect(() => {
    const addedTransactions = Object.values(transactions).filter(
      transaction =>
        [
          TxType.APPROVE,
          TxType.DEPOSIT_COLLATERAL,
          TxType.WITHDRAW_COLLATERAL,
          TxType.OPEN_PERPETUAL_TRADE,
        ].includes(transaction.type) &&
        transaction.asset === Asset.PERPETUALS &&
        [TxStatus.CONFIRMED, TxStatus.FAILED].includes(transaction.status) &&
        !completedTransactions[transaction.transactionHash],
    );

    if (addedTransactions.length > 0) {
      setCompletedTransactions(transactions => ({
        ...transactions,
        ...addedTransactions.reduce((acc, transaction) => {
          acc[transaction.transactionHash] = transaction;
          return acc;
        }, {}),
      }));
    }
  }, [completedTransactions, transactions]);

  return completedTransactions;
};
