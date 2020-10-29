import { toWei } from 'web3-utils';
import { bignumber } from 'mathjs';
import { Asset } from 'types/asset';
import { TransactionStatus } from 'types/transaction-status';
import { useAllowance } from '../useTokenAllowanceForLending';
import { useApprove } from '../useTokenApproveForLending';
import { useCallback, useEffect, useState } from 'react';
import { appContracts } from '../../../utils/blockchain/app-contracts';
import { useRemoveLiquidity } from './useRemoveLiquidity';
import { Sovryn } from '../../../utils/sovryn';
import TokenAbi from 'utils/blockchain/abi/abiTestToken.json';

enum TxType {
  NONE = 'none',
  APPROVE = 'approve',
  WITHDRAW = 'withdraw',
}

export function useApproveAndRemoveLiquidity(
  asset: Asset,
  poolAddress: string,
  amount: string,
  minReturn: string,
) {
  useEffect(() => {
    if (
      poolAddress &&
      poolAddress !== '0x0000000000000000000000000000000000000000' &&
      !Sovryn.writeContracts.hasOwnProperty(`liquidity_${asset}`) &&
      Sovryn.writeContracts[
        `liquidity_${asset}`
      ]?.options?.address.toLowerCase() !== poolAddress.toLowerCase()
    ) {
      Sovryn.addWriteContract(`liquidity_${asset}`, {
        address: poolAddress,
        abi: TokenAbi as any,
      });
    }

    console.log(Sovryn.writeContracts);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolAddress]);

  const allowance = useAllowance(
    `liquidity_${asset}` as any,
    appContracts.liquidityBTCProtocol.address,
  );

  const {
    approve,
    txHash: approveTx,
    status: approveStatus,
    loading: approveLoading,
  } = useApprove(
    `liquidity_${asset}` as any,
    appContracts.liquidityBTCProtocol.address,
  );

  const {
    withdraw,
    txHash: withdrawTx,
    status: withdrawStatus,
    loading: withdrawLoading,
  } = useRemoveLiquidity(asset, poolAddress, amount, minReturn);

  const handleApprove = useCallback(
    (weiAmount: string) => {
      approve(weiAmount);
    },
    [approve],
  );

  const handleWithdraw = useCallback(() => {
    if (!withdrawLoading) {
      withdraw();
    }
  }, [withdraw, withdrawLoading]);

  const handleTx = useCallback(() => {
    if (asset === Asset.BTC && bignumber(amount).greaterThan(allowance.value)) {
      handleApprove(toWei('1000000000', 'ether'));
    } else {
      handleWithdraw();
    }
  }, [asset, allowance.value, amount, handleApprove, handleWithdraw]);

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
      handleWithdraw();
    }
    // eslint-disable-next-line
  }, [approveStatus]);

  useEffect(() => {
    if (!withdrawLoading && approveStatus !== TransactionStatus.NONE) {
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
    if (!approveLoading && withdrawStatus !== TransactionStatus.NONE) {
      setTxState({
        type: TxType.WITHDRAW,
        txHash: withdrawTx,
        status: withdrawStatus,
        loading: withdrawLoading,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withdrawLoading, withdrawTx, withdrawStatus]);

  return {
    withdraw: () => handleTx(),
    ...txState,
  };
}
