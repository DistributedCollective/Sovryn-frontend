import { useCallback, useEffect, useState } from 'react';
import { toWei } from 'web3-utils';
import { bignumber } from 'mathjs';
import { Asset } from 'types/asset';
import { TransactionStatus } from 'types/transaction-status';
import { appContracts } from 'utils/blockchain/app-contracts';
import { useTokenAllowance } from '../useTokenAllowanceForLending';
import { useTokenApprove } from '../useTokenApproveForLending';
import { useAddLiquidity } from './useAddLiquidity';

enum TxType {
  NONE = 'none',
  APPROVE = 'approve',
  DEPOSIT = 'deposit',
}

export function useApproveAndAddLiquidity(
  asset: Asset,
  amount: string,
  minReturn: string,
) {
  const allowance = useTokenAllowance(
    asset,
    asset === Asset.BTC
      ? appContracts.liquidityBTCProtocol.address
      : appContracts.liquidityProtocol.address,
  );

  const {
    approve,
    txHash: approveTx,
    status: approveStatus,
    loading: approveLoading,
  } = useTokenApprove(
    asset,
    asset === Asset.BTC
      ? appContracts.liquidityBTCProtocol.address
      : appContracts.liquidityProtocol.address,
  );

  const {
    deposit,
    txHash: tradeTx,
    status: tradeStatus,
    loading: tradeLoading,
  } = useAddLiquidity(asset, amount, minReturn);

  const handleApprove = useCallback(
    (weiAmount: string) => {
      approve(weiAmount);
    },
    [approve],
  );

  const handleTrade = useCallback(() => {
    if (!tradeLoading) {
      deposit();
    }
  }, [deposit, tradeLoading]);

  const handleTx = useCallback(() => {
    if (asset !== Asset.BTC && bignumber(amount).greaterThan(allowance.value)) {
      handleApprove(toWei('1000000000', 'ether'));
    } else {
      handleTrade();
    }
  }, [allowance.value, amount, asset, handleApprove, handleTrade]);

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
        type: TxType.DEPOSIT,
        txHash: tradeTx,
        status: tradeStatus,
        loading: tradeLoading,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradeLoading, tradeTx, tradeStatus]);

  return {
    deposit: () => handleTx(),
    ...txState,
  };
}
