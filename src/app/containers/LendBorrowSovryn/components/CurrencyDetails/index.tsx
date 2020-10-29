import React, { useCallback, useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { bignumber } from 'mathjs';
import { toWei } from 'web3-utils';

import TabContainer from '../TabContainer';
import { Asset } from '../../../../../types/asset';
import { useAccount, useIsConnected } from '../../../../hooks/useAccount';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { useTokenAllowance } from '../../../../hooks/useTokenAllowanceForLending';
import { getLendingContract } from '../../../../../utils/blockchain/contract-helpers';
import { useTokenApproveForLending } from '../../../../hooks/useTokenApproveForLending';
import { useLendTokens } from '../../../../hooks/useLendTokens';
import { useLendTokensRBTC } from '../../../../hooks/useLendTokensRBTC';
import { TransactionStatus } from '../../../../../types/transaction-status';
import { useLending_transactionLimit } from '../../../../hooks/lending/useLending_transactionLimit';
import { useIsAmountWithinLimits } from '../../../../hooks/useIsAmountWithinLimits';

import '../../assets/index.scss';
import { useUnLendTokensRBTC } from '../../../../hooks/useUnLendTokensRBTC';
import { useUnLendTokens } from '../../../../hooks/useUnLendTokens';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { useLending_balanceOf } from '../../../../hooks/lending/useLending_balanceOf';
import { weiTo18 } from '../../../../../utils/blockchain/math-helpers';

type Props = {
  currency: 'BTC' | 'DOC';
};

export enum TxType {
  NONE = 'none',
  APPROVE = 'approve',
  LEND = 'lend',
  WITHDRAW = 'withdraw',
}

const CurrencyDetails: React.FC<Props> = ({ currency }) => {
  const [key, setKey] = useState<string | null>('lend');
  const [amount, setAmount] = useState<string>('');
  const isConnected = useIsConnected();
  let asset = currency === 'BTC' ? Asset.BTC : Asset.DOC;

  const weiAmount = useWeiAmount(amount);

  const { value: allowance } = useTokenAllowance(
    asset,
    getLendingContract(asset).address,
  );

  const onChangeAmount = (value: string) => {
    setAmount(value);
  };

  const [txState, setTxState] = useState<any>({
    type: TxType.NONE,
    txHash: null as any,
    status: TransactionStatus.NONE,
    loading: false,
  });

  // LENDING
  const { lend: lendToken, ...lendInfo } = useLendTokens(asset);
  const { lend: lendBTC, ...lendBtcInfo } = useLendTokensRBTC(asset);

  // WITHDRAW
  const { unLend: unlendToken, ...unlendInfo } = useUnLendTokens(asset);
  const { unLend: unlendBtc, ...unlendBtcInfo } = useUnLendTokensRBTC(asset);

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

  useEffect(() => {
    if (!approveLoading && lendInfo.status !== TransactionStatus.NONE) {
      setTxState({
        type: TxType.LEND,
        txHash: lendInfo.txHash,
        status: lendInfo.status,
        loading: lendInfo.loading,
      });
    } else if (
      !approveLoading &&
      lendBtcInfo.status !== TransactionStatus.NONE
    ) {
      setTxState({
        type: TxType.LEND,
        txHash: lendBtcInfo.txHash,
        status: lendBtcInfo.status,
        loading: lendBtcInfo.loading,
      });
    } else if (
      !approveLoading &&
      unlendInfo.status !== TransactionStatus.NONE
    ) {
      setTxState({
        type: TxType.WITHDRAW,
        txHash: unlendInfo.txHash,
        status: unlendInfo.status,
        loading: unlendInfo.loading,
      });
    } else if (
      !approveLoading &&
      unlendBtcInfo.status !== TransactionStatus.NONE
    ) {
      setTxState({
        type: TxType.WITHDRAW,
        txHash: unlendBtcInfo.txHash,
        status: unlendBtcInfo.status,
        loading: unlendBtcInfo.loading,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    approveLoading,
    lendBtcInfo.loading,
    lendBtcInfo.txHash,
    lendInfo.loading,
    lendBtcInfo.status,
    lendInfo.status,
    lendInfo.txHash,
    unlendInfo.status,
    unlendInfo.txHash,
    unlendBtcInfo.status,
    unlendBtcInfo.txHash,
  ]);

  // DEPOSIT SUBMIT
  const handleSubmit = () => {
    handleTx();
  };

  const handleApproveWithdraw = useCallback(
    (weiAmount: string) => {
      approve(weiAmount);
    },
    [approve],
  );

  const handleWithdraw = useCallback(
    (weiAmount: string) => {
      if (!(unlendInfo.loading && unlendBtcInfo.loading)) {
        if (asset === Asset.BTC) {
          unlendBtc(weiAmount);
        } else {
          unlendToken(weiAmount);
        }
      }
    },
    [unlendInfo.loading, unlendBtcInfo.loading, asset, unlendBtc, unlendToken],
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
  const handleSubmitWithdraw = () => {
    handleTxWithdraw();
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

  return (
    <div className="sovryn-tabs">
      <Tabs
        activeKey={key}
        onSelect={k => setKey(k as string)}
        defaultActiveKey="lend"
        id="borrow-&-lend-tabs"
      >
        <Tab eventKey="lend" title="LEND">
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
        </Tab>
        <Tab eventKey="borrow" title="BORROW">
          <TabContainer
            onMaxChange={onMaxChange}
            txState={txState}
            isConnected={isConnected}
            valid={valid}
            leftButton="Borrow"
            rightButton="Replay"
            amountValue={amount}
            onChangeAmount={onChangeAmount}
            handleSubmit={handleSubmit}
            currency={currency}
            amountName="Borrow Amount"
            maxValue={maxAmount}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default CurrencyDetails;
