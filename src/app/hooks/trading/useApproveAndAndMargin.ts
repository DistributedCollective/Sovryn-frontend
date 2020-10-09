import { bignumber } from 'mathjs';
import { toWei } from 'web3-utils';
import { Asset } from 'types/asset';
import { TransactionStatus } from 'types/transaction-status';
import { useTokenAllowance } from '../useTokenAllowanceForLending';
import { useTokenApprove } from '../useTokenApproveForLending';
import { useCallback, useEffect, useState } from 'react';
import { appContracts } from '../../../utils/blockchain/app-contracts';
import { useDepositCollateral } from './useDepositCollateral';

enum TxType {
  NONE = 'none',
  APPROVE = 'approve',
  TOP_UP = 'top_up',
}

export function useApproveAndAddMargin(
  collateralToken: Asset,
  loanId: string,
  depositAmount,
) {
  const allowance = useTokenAllowance(
    collateralToken,
    appContracts.sovrynProtocol.address,
  );

  const {
    approve,
    txHash: approveTx,
    status: approveStatus,
    loading: approveLoading,
  } = useTokenApprove(collateralToken, appContracts.sovrynProtocol.address);

  const {
    send,
    txHash: tradeTx,
    status: tradeStatus,
    loading: tradeLoading,
  } = useDepositCollateral(collateralToken, loanId, depositAmount);

  const handleApprove = useCallback(
    (weiAmount: string) => {
      approve(weiAmount);
    },
    [approve],
  );

  const handleTrade = useCallback(() => {
    if (!tradeLoading) {
      send();
    }
  }, [send, tradeLoading]);

  const handleTx = useCallback(() => {
    if (
      collateralToken !== Asset.BTC &&
      bignumber(depositAmount).greaterThan(allowance.value)
    ) {
      handleApprove(toWei('1000000', 'ether'));
    } else {
      handleTrade();
    }
  }, [depositAmount, allowance, handleApprove, handleTrade, collateralToken]);

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
      handleTrade();
    }
    // eslint-disable-next-line
  }, [approveStatus]);

  useEffect(() => {
    if (!tradeLoading && approveStatus !== TransactionStatus.NONE) {
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
    if (!approveLoading && tradeStatus !== TransactionStatus.NONE) {
      setTxState({
        type: TxType.TOP_UP,
        txHash: tradeTx,
        status: tradeStatus,
        loading: tradeLoading,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradeLoading, tradeTx, tradeStatus]);

  return {
    send: () => handleTx(),
    ...txState,
  };
}
