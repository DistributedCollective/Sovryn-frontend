import React, { useCallback, useEffect, useState } from 'react';
import { bignumber } from 'mathjs';
import { toWei } from 'web3-utils';

import { useAccount, useIsConnected } from '../../../hooks/useAccount';
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
import { useAssetBalanceOf } from '../../../hooks/useAssetBalanceOf';
import { useLending_balanceOf } from '../../../hooks/lending/useLending_balanceOf';
import { weiTo18 } from '../../../../utils/blockchain/math-helpers';

type Props = {
  currency: Asset;
};

const LendingContainer: React.FC<Props> = ({ currency }) => {
  const [amount, setAmount] = useState<string>('');
  const isConnected = useIsConnected();

  const weiAmount = useWeiAmount(amount);

  const { value: allowance } = useTokenAllowance(
    currency,
    getLendingContract(currency).address,
  );

  const onChangeAmount = (e: string) => {
    setAmount(e);
  };

  const { value: userBalance } = useAssetBalanceOf(currency as Asset);
  const { value: depositedBalance } = useLending_balanceOf(
    currency as Asset,
    useAccount(),
  );

  const onMaxChange = (type: string) => {
    let amount = '0';
    if (type === 'Deposit') {
      amount = userBalance;
    } else if (type === 'Withdraw') {
      amount = depositedBalance;
    }
    setAmount(weiTo18(amount));
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
  const { lend: lendToken, ...lendInfo } = useLendTokens(currency);
  const { lend: lendBTC, ...lendBtcInfo } = useLendTokensRBTC(currency);

  const {
    approve,
    txHash: approveTx,
    status: approveStatus,
    loading: approveLoading,
  } = useTokenApproveForLending(currency);

  const handleApprove = useCallback(
    (weiAmount: string) => {
      approve(weiAmount);
    },
    [approve],
  );

  const handleLending = useCallback(
    (weiAmount: string) => {
      if (!(lendInfo.loading && lendBtcInfo.loading)) {
        if (currency === Asset.BTC) {
          lendBTC(weiAmount);
        } else {
          lendToken(weiAmount);
        }
      }
    },
    [lendInfo.loading, lendBtcInfo.loading, currency, lendBTC, lendToken],
  );

  const handleTx = useCallback(() => {
    if (currency !== Asset.BTC && bignumber(weiAmount).greaterThan(allowance)) {
      handleApprove(toWei('1000000', 'ether'));
    } else {
      handleLending(weiAmount);
    }
  }, [currency, weiAmount, allowance, handleApprove, handleLending]);

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
  const handleSubmit = () => {
    handleTx();
  };

  // WITHDRAW
  const { unLend: unlendToken, loading: unlendLoadingToken } = useUnLendTokens(
    currency,
  );
  const { unLend: unlendBtc, loading: unlendLoadingBtc } = useUnLendTokensRBTC(
    currency,
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
        if (currency === Asset.BTC) {
          unlendBtc(weiAmount);
        } else {
          unlendToken(weiAmount);
        }
      }
    },
    [unlendLoadingToken, unlendLoadingBtc, currency, unlendBtc, unlendToken],
  );

  const handleTxWithdraw = useCallback(() => {
    if (currency !== Asset.BTC && bignumber(weiAmount).greaterThan(allowance)) {
      handleApproveWithdraw(toWei('1000000', 'ether'));
    } else {
      handleWithdraw(weiAmount);
    }
  }, [currency, weiAmount, allowance, handleApproveWithdraw, handleWithdraw]);

  const { value: maxAmount } = useLending_transactionLimit(currency, currency);

  const valid = useIsAmountWithinLimits(
    weiAmount,
    undefined,
    maxAmount !== '0' ? maxAmount : undefined,
  );

  // WITHDRAW SUBMIT
  const handleSubmitWithdraw = () => {
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
