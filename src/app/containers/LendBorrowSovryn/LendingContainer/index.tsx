import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { bignumber } from 'mathjs';

import { Asset } from 'types/asset';
import { weiTo18 } from 'utils/blockchain/math-helpers';

import { useAssetBalanceOf } from 'app/hooks/useAssetBalanceOf';
import { useLending_balanceOf } from 'app/hooks/lending/useLending_balanceOf';
import { useLending_approveAndLend } from 'app/hooks/lending/useLending_approveAndLend';
import { useLending_approveAndUnlend } from 'app/hooks/lending/useLending_approveAndUnlend';
import { useLending_transactionLimit } from 'app/hooks/lending/useLending_transactionLimit';
import { useIsAmountWithinLimits } from 'app/hooks/useIsAmountWithinLimits';
import { useAccount, useIsConnected } from 'app/hooks/useAccount';
import { useWeiAmount } from 'app/hooks/useWeiAmount';

import TabContainer from '../components/TabContainer';
import { actions } from '../slice';
import '../assets/index.scss';
import { SendTxResponse } from '../../../hooks/useSendContractTx';
import { TxType } from '../../../../store/global/transactions-store/types';
import { ButtonType } from '../types';
import { maxMinusFee } from '../../../../utils/helpers';
import { useLending_assetBalanceOf } from '../../../hooks/lending/useLending_assetBalanceOf';

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
  const { value: depositedAssetBalance } = useLending_assetBalanceOf(
    currency as Asset,
    useAccount(),
  );
  const {
    value: maxAmount,
    loading: loadingLimit,
  } = useLending_transactionLimit(currency, currency);

  const onMaxChange = (type: ButtonType) => {
    let amount = '0';
    if (type === ButtonType.DEPOSIT) {
      amount = maxMinusFee(userBalance, currency);
      if (maxAmount !== '0') {
        if (bignumber(amount).greaterThan(maxAmount)) {
          amount = maxAmount;
        }
      }
    } else if (type === ButtonType.REDEEM) {
      amount = depositedAssetBalance;
    }
    setAmount(weiTo18(amount));
  };

  const [txState, setTxState] = useState<SendTxResponse>({
    txHash: null as any,
    status: TxType.NONE,
    loading: false,
    txData: null,
  });

  const withdrawAmount = useMemo(() => {
    return bignumber(weiAmount)
      .mul(bignumber(depositedBalance).div(depositedAssetBalance))
      .toFixed(0);
  }, [weiAmount, depositedBalance, depositedAssetBalance]);

  // LENDING
  const { lend, ...lendTx } = useLending_approveAndLend(currency, weiAmount);
  const { unlend, ...unlendTx } = useLending_approveAndUnlend(
    currency,
    withdrawAmount,
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

  const validRedeem = useIsAmountWithinLimits(
    weiAmount,
    '1',
    depositedAssetBalance,
  );

  useEffect(() => {
    setTxState(lendTx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(lendTx)]);

  useEffect(() => {
    setTxState(unlendTx as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(unlendTx)]);

  useEffect(() => {
    dispatch(actions.changeLendAmount(amount));
  }, [amount, dispatch]);

  // reset amount to if currency was changed
  useEffect(() => {
    setAmount('');
  }, [currency]);

  return (
    <TabContainer
      onMaxChange={onMaxChange}
      txState={txState}
      isConnected={isConnected}
      valid={valid}
      validRedeem={validRedeem}
      leftButton={ButtonType.DEPOSIT}
      rightButton={ButtonType.REDEEM}
      amountValue={amount}
      onChangeAmount={onChangeAmount}
      handleSubmit={handleLendSubmit}
      handleSubmitWithdraw={handleUnlendSubmit}
      currency={currency}
      maxValue={maxAmount}
      loadingLimit={loadingLimit}
    />
  );
};

export default LendingContainer;
