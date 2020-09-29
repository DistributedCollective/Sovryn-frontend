import { bignumber } from 'mathjs';
import { toWei } from 'web3-utils';
import { Asset } from 'types/asset';
import { TransactionStatus } from 'types/transaction-status';
import { getLendingContract } from 'utils/blockchain/contract-helpers';
import { useTokenAllowance } from '../useTokenAllowanceForLending';
import { useTokenApprove } from '../useTokenApproveForLending';
import { useCallback, useEffect, useState } from 'react';
import { useMarginTrade } from './useMarginTrade';
import { useAccount } from '../useAccount';

enum TxType {
  NONE = 'none',
  APPROVE = 'approve',
  TRADE = 'trade',
}

export function useApproveAndTrade(
  lendingContract: Asset,
  token: Asset,
  leverage: number,
  weiAmount: string,
  // loanId,
  // loanTokenSent,
  // collateralTokenAddress,
) {
  const account = useAccount();
  const allowance = useTokenAllowance(
    token,
    getLendingContract(lendingContract).address,
  );

  const {
    approve,
    txHash: approveTx,
    status: approveStatus,
    loading: approveLoading,
  } = useTokenApprove(token, getLendingContract(lendingContract).address);

  const {
    trade,
    txHash: tradeTx,
    status: tradeStatus,
    loading: tradeLoading,
  } = useMarginTrade(
    lendingContract,
    '0x0000000000000000000000000000000000000000000000000000000000000000', //0 if new loan
    toWei(String(leverage - 1), 'ether'),
    0,
    weiAmount,
    token,
    account, // trader
    '0x',
  );

  const handleApprove = useCallback(
    (weiAmount: string) => {
      approve(weiAmount);
    },
    [approve],
  );

  const handleTrade = useCallback(() => {
    if (!tradeLoading) {
      trade();
    }
  }, [trade, tradeLoading]);

  const handleTx = useCallback(() => {
    if (
      token !== Asset.BTC &&
      bignumber(weiAmount).greaterThan(allowance.value)
    ) {
      handleApprove(toWei('1000000', 'ether'));
    } else {
      handleTrade();
    }
  }, [token, allowance, weiAmount, handleApprove, handleTrade]);

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
        type: TxType.TRADE,
        txHash: tradeTx,
        status: tradeStatus,
        loading: tradeLoading,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradeLoading, tradeTx, tradeStatus]);

  return {
    trade: () => handleTx(),
    ...txState,
  };
}
