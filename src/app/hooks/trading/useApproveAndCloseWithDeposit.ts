import { bignumber } from 'mathjs';
import { toWei } from 'web3-utils';
import { Asset } from 'types/asset';
import { TransactionStatus } from 'types/transaction-status';
import { getLendingContract } from 'utils/blockchain/contract-helpers';
import { useTokenAllowance } from '../useTokenAllowanceForLending';
import { useTokenApprove } from '../useTokenApproveForLending';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from '../useAccount';
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';
import { useCloseWithDeposit } from './useCloseWithDepsit';

enum TxType {
  NONE = 'none',
  APPROVE = 'approve',
  BORROW = 'borrow',
}

export function useApproveAndCloseWithDeposit(
  lendingContract: Asset,
  token: Asset,
  withdrawAmount: string,
) {
  const getToken = useCallback(() => {
    if (lendingContract === token) {
      return AssetsDictionary.get(lendingContract).primaryCollateralAsset;
    }
    return token;
  }, [lendingContract, token]);

  const account = useAccount();
  const allowance = useTokenAllowance(
    getToken(),
    getLendingContract(lendingContract).address,
  );

  const {
    approve,
    txHash: approveTx,
    status: approveStatus,
    loading: approveLoading,
  } = useTokenApprove(
    token,
    getLendingContract(lendingContract === Asset.BTC ? Asset.DOC : Asset.BTC)
      .address,
  );

  // @ts-ignore
  const { closeWithDeposit, txHash, status, loading } = useCloseWithDeposit(
    lendingContract,
    '0x0000000000000000000000000000000000000000000000000000000000000000', //0 if new loan
    account, // receiver
    '1000000000000000000', // withdrawAmount
  );

  const handleApprove = useCallback(
    (weiAmount: string) => {
      approve(weiAmount);
    },
    [approve],
  );

  const handleCloseWithDeposit = useCallback(() => {
    if (!loading) {
      closeWithDeposit();
    }
  }, [closeWithDeposit, loading]);

  const handleTx = useCallback(() => {
    if (
      token !== Asset.BTC &&
      bignumber(withdrawAmount).greaterThan(allowance.value)
    ) {
      handleApprove(toWei('1000000000000000000' /*withdrawAmount*/, 'ether'));
    } else {
      handleCloseWithDeposit();
    }
  }, [
    token,
    withdrawAmount,
    allowance.value,
    handleApprove,
    handleCloseWithDeposit,
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
      handleCloseWithDeposit();
    }
    // eslint-disable-next-line
  }, [approveStatus]);

  useEffect(() => {
    if (!loading && approveStatus !== TransactionStatus.NONE) {
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
    if (!approveLoading && status !== TransactionStatus.NONE) {
      setTxState({
        type: TxType.BORROW,
        txHash: txHash,
        status: status,
        loading: loading,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, txHash, status]);

  return {
    closeWithDeposit: () => handleTx(),
    ...txState,
  };
}
