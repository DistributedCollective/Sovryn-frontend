import { bignumber } from 'mathjs';
import { toWei } from 'web3-utils';
import { Asset } from 'types/asset';
import { TransactionStatus } from 'types/transaction-status';
import { getLendingContract } from 'utils/blockchain/contract-helpers';
import { useTokenAllowance } from '../useTokenAllowanceForLending';
import { useTokenApprove } from '../useTokenApproveForLending';
import { useCallback, useEffect, useState } from 'react';
import { useBorrow } from './useBorrow';

enum TxType {
  NONE = 'none',
  APPROVE = 'approve',
  BORROW = 'borrow',
}

export function useApproveAndBorrow(
  borrowToken: Asset,
  collateralToken: Asset,
  withdrawAmount: string,
  collateralTokenSent: string,
  initialLoanDuration: string,
  // loanId,
  // loanTokenSent,
  // collateralTokenAddress,
) {
  const allowance = useTokenAllowance(
    collateralToken,
    getLendingContract(borrowToken).address,
  );

  const {
    approve,
    txHash: approveTx,
    status: approveStatus,
    loading: approveLoading,
  } = useTokenApprove(collateralToken, getLendingContract(borrowToken).address);

  const {
    borrow,
    txHash: borrowTx,
    status: borrowStatus,
    loading: borrowLoading,
  } = useBorrow(
    borrowToken,
    '0x0000000000000000000000000000000000000000000000000000000000000000', //0 if new loan
    withdrawAmount,
    initialLoanDuration,
    collateralTokenSent,
    collateralToken,
  );

  const handleApprove = useCallback(
    (weiAmount: string) => {
      approve(weiAmount);
    },
    [approve],
  );

  const handleBorrow = useCallback(() => {
    if (!borrowLoading) {
      borrow();
    }
  }, [borrow, borrowLoading]);

  const handleTx = useCallback(() => {
    if (
      collateralToken !== Asset.BTC &&
      bignumber(withdrawAmount).greaterThan(allowance.value)
    ) {
      handleApprove(toWei('1000000000000000000' /*withdrawAmount*/, 'ether'));
    } else {
      handleBorrow();
    }
  }, [
    collateralToken,
    withdrawAmount,
    allowance.value,
    handleApprove,
    handleBorrow,
  ]);

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
      handleBorrow();
    }
    // eslint-disable-next-line
  }, [approveStatus]);

  useEffect(() => {
    if (!borrowLoading && approveStatus !== TransactionStatus.NONE) {
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
        loading: borrowLoading,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [borrowLoading, borrowTx, borrowStatus]);

  return {
    borrow: () => handleTx(),
    ...txState,
  };
}
