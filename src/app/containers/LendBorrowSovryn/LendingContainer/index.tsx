import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { bignumber } from 'mathjs';
import { toWei } from 'web3-utils';

import { useIsConnected } from '../../../hooks/useAccount';
import { Asset } from '../../../../types/asset';
import { useWeiAmount } from '../../../hooks/useWeiAmount';
import { useTokenAllowance } from '../../../hooks/useTokenAllowanceForLending';
import { getLendingContract } from '../../../../utils/blockchain/contract-helpers';
import { TransactionStatus } from '../../../../types/transaction-status';
import { useLendTokens } from '../../../hooks/useLendTokens';
import { useLendTokensRBTC } from '../../../hooks/useLendTokensRBTC';
import { useTokenApproveForLending } from '../../../hooks/useTokenApproveForLending';
import { useUnLendTokens } from '../../../hooks/useUnLendTokens';
import { useUnLendTokensRBTC } from '../../../hooks/useUnLendTokensRBTC';
import { useLending_transactionLimit } from '../../../hooks/lending/useLending_transactionLimit';
import { useIsAmountWithinLimits } from '../../../hooks/useIsAmountWithinLimits';
import TabContainer, { TxType } from '../components/TabContainer';
import '../assets/index.scss';

type Props = {
  currency: 'BTC' | 'DOC';
};

const LendingContainer: React.FC<Props> = ({ currency }) => {
  const [amount, setAmount] = useState<string>('');
  const isConnected = useIsConnected();
  let asset = currency === 'BTC' ? Asset.BTC : Asset.DOC;

  const weiAmount = useWeiAmount(amount);

  const { value: allowance } = useTokenAllowance(
    asset,
    getLendingContract(asset).address,
  );

  const onChangeAmount = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value as string);
  };

  const onMaxChange = (max: string) => {
    setAmount(max);
  };

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

  // LENDING
  const { lend: lendToken, ...lendInfo } = useLendTokens(asset);
  const { lend: lendBTC, ...lendBtcInfo } = useLendTokensRBTC(asset);

  const {
    approve,
    txHash: approveTx,
    status: approveStatus,
    loading: approveLoading,
  } = useTokenApproveForLending(asset);

  const handleApprove = useCallback(
    (weiAmount: string) => {
      approve(weiAmount);
    },
    [approve],
  );

  const handleLending = useCallback(
    (weiAmount: string) => {
      if (!(lendInfo.loading && lendBtcInfo.loading)) {
        if (asset === Asset.BTC) {
          lendBTC(weiAmount);
        } else {
          lendToken(weiAmount);
        }
      }
    },
    [lendInfo.loading, lendBtcInfo.loading, asset, lendBTC, lendToken],
  );

  const handleTx = useCallback(() => {
    if (asset !== Asset.BTC && bignumber(weiAmount).greaterThan(allowance)) {
      handleApprove(toWei('1000000', 'ether'));
    } else {
      handleLending(weiAmount);
    }
  }, [asset, weiAmount, allowance, handleApprove, handleLending]);

  useEffect(() => {
    if (approveStatus === TransactionStatus.SUCCESS) {
      handleLending(weiAmount);
    }
    // eslint-disable-next-line
  }, [approveStatus]);

  useEffect(() => {
    if (
      !lendInfo.loading &&
      !lendBtcInfo.loading &&
      approveStatus !== TransactionStatus.NONE
    ) {
      setTxState({
        type: TxType.APPROVE,
        txHash: approveTx,
        status: approveStatus,
        loading: approveLoading,
      });
    }
  }, [
    approveLoading,
    approveTx,
    approveStatus,
    lendInfo.loading,
    lendBtcInfo.loading,
  ]);

  // DEPOSIT SUBMIT
  const handleSubmit = e => {
    e.preventDefault();
    handleTx();
  };

  // WITHDRAW
  const { unLend: unlendToken, loading: unlendLoadingToken } = useUnLendTokens(
    asset,
  );
  const { unLend: unlendBtc, loading: unlendLoadingBtc } = useUnLendTokensRBTC(
    asset,
  );

  const handleApproveWithdraw = useCallback(
    (weiAmount: string) => {
      approve(weiAmount);
    },
    [approve],
  );

  const handleWithdraw = useCallback(
    (weiAmount: string) => {
      if (!(unlendLoadingToken && unlendLoadingBtc)) {
        if (asset === Asset.BTC) {
          unlendBtc(weiAmount);
        } else {
          unlendToken(weiAmount);
        }
      }
    },
    [unlendLoadingToken, unlendLoadingBtc, asset, unlendBtc, unlendToken],
  );

  const handleTxWithdraw = useCallback(() => {
    if (asset !== Asset.BTC && bignumber(weiAmount).greaterThan(allowance)) {
      handleApproveWithdraw(toWei('1000000', 'ether'));
    } else {
      handleWithdraw(weiAmount);
    }
  }, [asset, weiAmount, allowance, handleApproveWithdraw, handleWithdraw]);

  const { value: maxAmount } = useLending_transactionLimit(asset, asset);

  const valid = useIsAmountWithinLimits(
    weiAmount,
    undefined,
    maxAmount !== '0' ? maxAmount : undefined,
  );

  // WITHDRAW SUBMIT
  const handleSubmitWithdraw = e => {
    e.preventDefault();
    handleTxWithdraw();
  };

  return (
    <TabContainer
      onMaxChange={onMaxChange}
      txState={txState}
      isConnected={isConnected}
      valid={valid}
      leftButton="Deposit"
      rightButton="Withdraw"
      amountValue={amount}
      onChangeAmount={onChangeAmount}
      handleSubmit={handleSubmit}
      handleSubmitWithdraw={handleSubmitWithdraw}
      currency={currency}
      amountName="Deposit Amount"
      maxValue={maxAmount}
    />
  );
};

export default LendingContainer;
