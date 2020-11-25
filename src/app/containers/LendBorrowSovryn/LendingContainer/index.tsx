import React, { useCallback, useEffect, useState } from 'react';

import { useAccount, useIsConnected } from '../../../hooks/useAccount';
import { Asset } from '../../../../types/asset';
import { useWeiAmount } from '../../../hooks/useWeiAmount';
import { TransactionStatus } from '../../../../types/transaction-status';
import { useLending_transactionLimit } from '../../../hooks/lending/useLending_transactionLimit';
import { useIsAmountWithinLimits } from '../../../hooks/useIsAmountWithinLimits';
import TabContainer, { TxType } from '../components/TabContainer';
import '../assets/index.scss';
import { useAssetBalanceOf } from '../../../hooks/useAssetBalanceOf';
import { useLending_balanceOf } from '../../../hooks/lending/useLending_balanceOf';
import { weiTo18 } from '../../../../utils/blockchain/math-helpers';
import { useLending_approveAndLend } from '../../../hooks/lending/useLending_approveAndLend';
import { useLending_approveAndUnlend } from '../../../hooks/lending/useLending_approveAndUnlend';
import { actions } from '../slice';
import { useDispatch } from 'react-redux';
import { min } from 'mathjs';

type Props = {
  currency: Asset;
};

const LendingContainer: React.FC<Props> = ({ currency }) => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState<string>('');
  const isConnected = useIsConnected();

  const weiAmount = useWeiAmount(amount);

  const onChangeAmount = (e: string) => {
    setAmount(e);
  };

  const { value: userBalance } = useAssetBalanceOf(currency as Asset);
  const { value: depositedBalance } = useLending_balanceOf(
    currency as Asset,
    useAccount(),
  );
  const {
    value: maxAmount,
    loading: loadingLimit,
  } = useLending_transactionLimit(currency, currency);

  const onMaxChange = (type: string) => {
    let amount = '0';
    if (type === 'Deposit') {
      amount = min(userBalance, maxAmount);
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
  const { lend, ...lendTx } = useLending_approveAndLend(currency, weiAmount);
  const { unlend, ...unlendTx } = useLending_approveAndUnlend(
    currency,
    weiAmount,
  );

  const handleLendSubmit = useCallback(() => {
    if (!lendTx.loading) {
      lend();
    }
  }, [lendTx.loading, lend]);

  const handleUnlendSubmit = useCallback(() => {
    if (!unlendTx.loading) {
      unlend();
    }
  }, [unlendTx.loading, unlend]);

  const valid = useIsAmountWithinLimits(
    weiAmount,
    '1',
    maxAmount !== '0' ? maxAmount : undefined,
  );

  useEffect(() => {
    setTxState(lendTx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(lendTx)]);

  useEffect(() => {
    setTxState(unlendTx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(unlendTx)]);

  useEffect(() => {
    dispatch(actions.changeLendAmount(amount));
  }, [amount, dispatch]);

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
      handleSubmit={handleLendSubmit}
      handleSubmitWithdraw={handleUnlendSubmit}
      currency={currency}
      amountName="Deposit Amount"
      maxValue={maxAmount}
      loadingLimit={loadingLimit}
    />
  );
};

export default LendingContainer;
