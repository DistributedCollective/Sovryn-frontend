import { bignumber } from 'mathjs';
import { toWei } from 'web3-utils';
import { Asset } from 'types/asset';
import { TransactionStatus } from 'types/transaction-status';
import { useTokenAllowance } from '../useTokenAllowanceForLending';
import { useTokenApprove } from '../useTokenApproveForLending';
import { useCallback, useEffect, useState } from 'react';
import { useCloseWithDeposit } from './useCloseWithDeposit';
import { getContract } from '../../../utils/blockchain/contract-helpers';

enum TxType {
  NONE = 'none',
  APPROVE = 'approve',
  BORROW = 'borrow',
}

export function useApproveAndCloseWithDeposit(
  borrowToken: Asset,
  collateralToken: Asset,
  loanId: string,
  receiver: string,
  repayAmount: string,
) {
  const allowance = useTokenAllowance(
    borrowToken,
    getContract('sovrynProtocol').address,
  );

  const {
    approve,
    txHash: approveTx,
    status: approveStatus,
    loading: approveLoading,
  } = useTokenApprove(borrowToken, getContract('sovrynProtocol').address);

  const {
    send,
    txHash: borrowTx,
    status: borrowStatus,
    loading: repayLoading,
  } = useCloseWithDeposit(borrowToken, loanId, receiver, repayAmount);

  const handleApprove = useCallback(
    (weiAmount: string) => {
      approve(weiAmount);
    },
    [approve],
  );

  const handleRepay = useCallback(() => {
    if (!repayLoading) {
      send();
    }
  }, [repayLoading, send]);

  const handleTx = useCallback(() => {
    if (
      borrowToken !== Asset.BTC &&
      bignumber(repayAmount).greaterThan(allowance.value)
    ) {
      handleApprove(toWei(repayAmount, 'ether'));
    } else {
      handleRepay();
    }
  }, [borrowToken, repayAmount, allowance.value, handleApprove, handleRepay]);

  const [txState, setTxState] = useState<{
    type: TxType;
    txHash: string;
    status: TransactionStatus;
    loading: boolean;
  }>({
    type: TxType.NONE,
    txHash: null as any,
    status: TransactionStatus.NONE,
    loading: false,
  });

  useEffect(() => {
    if (approveStatus === TransactionStatus.SUCCESS) {
      handleRepay();
    }
    // eslint-disable-next-line
  }, [approveStatus]);

  useEffect(() => {
    if (!repayLoading && approveStatus !== TransactionStatus.NONE) {
      setTxState({
        type: TxType.APPROVE,
        txHash: approveTx,
        status: approveStatus,
        loading: approveLoading,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approveLoading, approveTx, approveStatus]);

  useEffect(() => {
    if (!approveLoading && borrowStatus !== TransactionStatus.NONE) {
      setTxState({
        type: TxType.BORROW,
        txHash: borrowTx,
        status: borrowStatus,
        loading: repayLoading,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repayLoading, borrowTx, borrowStatus]);

  return {
    send: () => handleTx(),
    ...txState,
  };
}
