import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Row, Tab, Tabs } from 'react-bootstrap';
import clsx from 'clsx';
import { bignumber } from 'mathjs';
import { toWei } from 'web3-utils';

import TabContainer from '../TabContainer';
import { Asset } from '../../../../../types/asset';
import { useIsConnected } from '../../../../hooks/useAccount';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { useTokenAllowance } from '../../../../hooks/useTokenAllowanceForLending';
import { getLendingContract } from '../../../../../utils/blockchain/contract-helpers';
import {
  useTokenApprove,
  useTokenApproveForLending,
} from '../../../../hooks/useTokenApproveForLending';
import { useLendTokens } from '../../../../hooks/useLendTokens';
import { useLendTokensRBTC } from '../../../../hooks/useLendTokensRBTC';
import { TransactionStatus } from '../../../../../types/transaction-status';
import { useLending_transactionLimit } from '../../../../hooks/lending/useLending_transactionLimit';
import { useIsAmountWithinLimits } from '../../../../hooks/useIsAmountWithinLimits';

import '../../assets/index.scss';
import { useUnLendTokensRBTC } from '../../../../hooks/useUnLendTokensRBTC';
import { useUnLendTokens } from '../../../../hooks/useUnLendTokens';

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
    <Row className="w-100">
      <Tabs
        className={clsx('tabs', currency === 'DOC' && 'tabs__green')}
        activeKey={key}
        onSelect={k => setKey(k as string)}
        defaultActiveKey="lend"
        id="borrow-&-lend-tabs"
      >
        <Tab eventKey="lend" title="LEND" />
        <Tab eventKey="borrow" title="BORROW" />
      </Tabs>
      {key === 'lend' && (
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
      )}
      {key === 'borrow' && (
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
      )}
    </Row>
  );
};

export default CurrencyDetails;
