/**
 *
 * LendingTokenSelectorCard
 *
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Icon, InputGroup, Tag } from '@blueprintjs/core';
import { toWei } from 'web3-utils';
import { Asset } from 'types/asset';
import { useTokenApproveForLending } from '../../../hooks/useTokenApproveForLending';
import { useTokenAllowanceForLending } from '../../../hooks/useTokenAllowanceForLending';
import { bignumber } from 'mathjs';
import { useLendTokens } from '../../../hooks/useLendTokens';
import { TransactionStatus } from '../../../types/transaction-status';
import { AssetInterestRate } from '../AssetInterestRate';
import { LenderBalance } from '../LenderBalance';
import { LinkToExplorer } from '../LinkToExplorer';
import { SendTxProgress } from '../SendTxProgress';

interface Props {
  asset: Asset;
}

enum TxType {
  NONE = 'none',
  APPROVE = 'approve',
  LEND = 'lend',
}

export function LendingTokenSelectorCard(props: Props) {
  const [amount, setAmount] = useState('0.01');

  const allowance = useTokenAllowanceForLending(props.asset);

  const {
    approve,
    txHash: approveTx,
    status: approveStatus,
    loading: approveLoading,
  } = useTokenApproveForLending(props.asset);

  const {
    lend,
    txHash: lendTx,
    status: lendStatus,
    loading: lendLoading,
  } = useLendTokens(props.asset);

  const handleApprove = useCallback(
    (weiAmount: string) => {
      approve(weiAmount);
    },
    [approve],
  );

  const handleLending = useCallback(
    (weiAmount: string) => {
      if (!lendLoading) {
        lend(weiAmount);
      }
    },
    [lend, lendLoading],
  );

  const handleSubmit = e => {
    e.preventDefault();
    handleTx();
  };

  const handleTx = useCallback(() => {
    const weiAmount = toWei(amount, 'ether');
    if (bignumber(weiAmount).greaterThan(allowance)) {
      handleApprove(toWei('1000000', 'ether'));
    } else {
      handleLending(weiAmount);
    }
  }, [allowance, amount, handleApprove, handleLending]);

  useEffect(() => {
    if (approveStatus === TransactionStatus.SUCCESS) {
      handleLending(toWei(amount, 'ether'));
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
    if (!lendLoading && approveStatus !== TransactionStatus.NONE) {
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
    if (!approveLoading && lendStatus !== TransactionStatus.NONE) {
      setTxState({
        type: TxType.LEND,
        txHash: lendTx,
        status: lendStatus,
        loading: lendLoading,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lendLoading, lendTx, lendStatus]);

  return (
    <form className="d-block p-5 shadow border" onSubmit={handleSubmit}>
      <div className="row mt-3 d-flex align-items-center">
        <div className="col-6">
          <h2>{props.asset}</h2>
        </div>
        <div className="col-6 text-right">
          <div>Interest APR:</div>
          <AssetInterestRate asset={props.asset} />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-6">Enter deposit amount</div>
        <div className="col-6">
          <InputGroup
            placeholder="Amount"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            readOnly={txState.loading}
            rightElement={<Tag minimal>{props.asset}</Tag>}
          />
        </div>
      </div>
      <div className="mt-3 d-flex flex-row justify-content-start align-items-center overflow-hidden">
        <Button
          className="mr-3 flex-shrink-0 flex-grow-0"
          text={`Lend ${props.asset}`}
          type="submit"
          loading={txState.loading}
          disabled={txState.loading}
        />
        {txState.type !== TxType.NONE && (
          <SendTxProgress
            status={txState.status}
            txHash={txState.txHash}
            loading={txState.loading}
          />
        )}
      </div>
      <LenderBalance asset={props.asset} />
    </form>
  );
}
