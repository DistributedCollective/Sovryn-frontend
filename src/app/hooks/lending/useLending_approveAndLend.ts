import { useCallback, useEffect, useState } from 'react';
import { bignumber } from 'mathjs';
import { toWei } from 'web3-utils';
import { Asset } from 'types/asset';
import { TransactionStatus } from 'types/transaction-status';
import { getLendingContract } from 'utils/blockchain/contract-helpers';
import { useTokenAllowance } from '../useTokenAllowanceForLending';
import { useTokenApprove } from '../useTokenApproveForLending';
import { useLending_mint } from './useLending_mint';

enum TxType {
  NONE = 'none',
  APPROVE = 'approve',
  LEND = 'lend',
}

export function useLending_approveAndLend(asset: Asset, depositAmount: string) {
  const allowance = useTokenAllowance(asset, getLendingContract(asset).address);

  const {
    approve,
    txHash: approveTx,
    status: approveStatus,
    loading: approveLoading,
  } = useTokenApprove(asset, getLendingContract(asset).address);

  const { send: mint, ...mintTx } = useLending_mint(asset, depositAmount);

  const handleApprove = useCallback(
    (weiAmount: string) => {
      approve(weiAmount);
    },
    [approve],
  );

  const handleMint = useCallback(() => {
    if (!mintTx.loading) {
      mint();
    }
  }, [mintTx, mint]);

  const handleTx = useCallback(() => {
    if (
      asset !== Asset.BTC &&
      bignumber(depositAmount).greaterThan(allowance.value)
    ) {
      handleApprove(toWei(depositAmount, 'ether'));
    } else {
      handleMint();
    }
  }, [asset, depositAmount, allowance.value, handleApprove, handleMint]);

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
      handleMint();
    }
    // eslint-disable-next-line
  }, [approveStatus]);

  useEffect(() => {
    if (!mintTx.loading && approveStatus !== TransactionStatus.NONE) {
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
    if (!approveLoading && mintTx.status !== TransactionStatus.NONE) {
      setTxState({
        type: TxType.LEND,
        ...mintTx,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mintTx.loading, mintTx.status]);

  return {
    lend: () => handleTx(),
    ...txState,
  };
}
