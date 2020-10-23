import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Row, Tab, Tabs } from 'react-bootstrap';
import clsx from 'clsx';
import TabContainer from '../TabContainer';
import { Asset } from '../../../../../types/asset';
import { useIsConnected } from '../../../../hooks/useAccount';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { useTokenAllowance } from '../../../../hooks/useTokenAllowanceForLending';
import { getLendingContract } from '../../../../../utils/blockchain/contract-helpers';
import { useTokenApproveForLending } from '../../../../hooks/useTokenApproveForLending';
import { useLendTokens } from '../../../../hooks/useLendTokens';
import { useLendTokensRBTC } from '../../../../hooks/useLendTokensRBTC';
import { bignumber } from 'mathjs';
import { toWei } from 'web3-utils';
import { TransactionStatus } from '../../../../../types/transaction-status';
import { useLending_transactionLimit } from '../../../../hooks/lending/useLending_transactionLimit';
import { useIsAmountWithinLimits } from '../../../../hooks/useIsAmountWithinLimits';
import '../../assets/index.scss';

type Props = {
  currency: 'BTC' | 'DOC';
};

export enum TxType {
  NONE = 'none',
  APPROVE = 'approve',
  LEND = 'lend',
}

const CurrencyDetails: React.FC<Props> = ({ currency }) => {
  const [key, setKey] = useState<string | null>('lend');
  const [amount, setAmount] = useState<string>('');
  let asset = currency === 'BTC' ? Asset.BTC : Asset.DOC;

  const onChangeAmount = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value as string);
  };
  const isConnected = useIsConnected();

  const weiAmount = useWeiAmount(amount);

  const { value: allowance } = useTokenAllowance(
    asset,
    getLendingContract(asset).address,
  );

  const {
    approve,
    txHash: approveTx,
    status: approveStatus,
    loading: approveLoading,
  } = useTokenApproveForLending(asset);

  const { lend, ...lendInfo } = useLendTokens(asset);

  const { lend: lendBTC, ...lendBtcInfo } = useLendTokensRBTC(asset);

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
          lend(weiAmount);
        }
      }
    },
    [lendInfo.loading, lendBtcInfo.loading, asset, lendBTC, lend],
  );

  const handleSubmit = e => {
    e.preventDefault();
    handleTx();
  };

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
  ]);

  const { value: maxAmount } = useLending_transactionLimit(asset, asset);

  const valid = useIsAmountWithinLimits(
    weiAmount,
    undefined,
    maxAmount !== '0' ? maxAmount : undefined,
  );

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
          txState={txState}
          isConnected={isConnected}
          valid={valid}
          accountBalanceValue="2.736587"
          leftButton="Deposit"
          rightButton="Withdraw"
          amountValue={amount}
          onChangeAmount={onChangeAmount}
          handleSubmit={handleSubmit}
          currency={currency}
          amountName="Deposit Amount"
          maxValue="119.8648"
          minValue="0.0100"
        />
      )}
      {key === 'borrow' && (
        <TabContainer
          txState={txState}
          isConnected={isConnected}
          valid={valid}
          accountBalanceValue="2.736587"
          leftButton="Borrow"
          rightButton="Replay"
          amountValue={amount}
          onChangeAmount={onChangeAmount}
          handleSubmit={handleSubmit}
          currency={currency}
          amountName="Borrow Amount"
          minValue="0.0100"
          maxValue="119.8648"
        />
      )}
    </Row>
  );
};

export default CurrencyDetails;
