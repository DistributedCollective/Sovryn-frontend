import { useCallback, useEffect, useState } from 'react';
import { bignumber } from 'mathjs';
import { toWei } from 'web3-utils';
import { Asset } from 'types/asset';
import { TransactionStatus } from 'types/transaction-status';
import { getLendingContract } from 'utils/blockchain/contract-helpers';
import { useTokenAllowance } from '../useTokenAllowanceForLending';
import { useTokenApprove } from '../useTokenApproveForLending';
import { useLending_burn } from './useLending_burn';

enum TxType {
  NONE = 'none',
  APPROVE = 'approve',
  WITHDRAW = 'withdraw',
}

export function useLending_approveAndUnlend(
  asset: Asset,
  withdrawAmount: string,
) {
  const allowance = useTokenAllowance(asset, getLendingContract(asset).address);

  const {
    approve,
    txHash: approveTx,
    status: approveStatus,
    loading: approveLoading,
  } = useTokenApprove(asset, getLendingContract(asset).address);

  const { send: burn, ...burnTx } = useLending_burn(asset, withdrawAmount);

  const handleApprove = useCallback(
    (weiAmount: string) => {
      approve(weiAmount);
    },
    [approve],
  );

  const handleBurn = useCallback(() => {
    if (!burnTx.loading) {
      burn();
    }
  }, [burnTx, burn]);

  const handleTx = useCallback(() => {
    if (
      asset !== Asset.BTC &&
      bignumber(withdrawAmount).greaterThan(allowance.value)
    ) {
      handleApprove(toWei(withdrawAmount, 'ether'));
    } else {
      handleBurn();
    }
  }, [asset, withdrawAmount, allowance.value, handleApprove, handleBurn]);

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
      handleBurn();
    }
    // eslint-disable-next-line
  }, [approveStatus]);

  useEffect(() => {
    if (!burnTx.loading && approveStatus !== TransactionStatus.NONE) {
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
    if (!approveLoading && burnTx.status !== TransactionStatus.NONE) {
      setTxState({
        type: TxType.WITHDRAW,
        ...burnTx,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [burnTx.loading, burnTx.status]);

  return {
    unlend: () => handleTx(),
    ...txState,
  };
}
