/**
 *
 * LendingTokenSelectorCard
 *
 */
import React, { useCallback, useEffect, useState } from 'react';
import { InputGroup, Tag, Tooltip } from '@blueprintjs/core';
import { toWei } from 'web3-utils';
import styled from 'styled-components';
import { Asset } from 'types/asset';
import { useTokenApproveForLending } from '../../hooks/useTokenApproveForLending';
import { useTokenAllowance } from '../../hooks/useTokenAllowanceForLending';
import { bignumber } from 'mathjs';
import { useLendTokensRBTC } from '../../hooks/useLendTokensRBTC';
import { TransactionStatus } from '../../../types/transaction-status';
import { AssetInterestRate } from '../AssetInterestRate';
import { LenderBalance } from '../LenderBalance';
import { SendTxProgress } from '../SendTxProgress';
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { getLendingContract } from '../../../utils/blockchain/contract-helpers';
import { useIsConnected } from '../../hooks/useAccount';
import { useMaxDepositAmount } from '../../hooks/lending/useMaxDepositAmount';
import { weiTo4 } from '../../../utils/blockchain/math-helpers';
import { useAmountState } from '../../hooks/useAmountState';
import { useIsAmountWithinLimits } from '../../hooks/useIsAmountWithinLimits';
import { CustomDialog } from '../CustomDialog';
import { LendingHistory } from '../../containers/LendingHistory';

import tooltipData from 'utils/data/tooltip-text.json';
import { useLendTokens } from '../../hooks/useLendTokens';

interface Props {
  asset: Asset;
}

enum TxType {
  NONE = 'none',
  APPROVE = 'approve',
  LEND = 'lend',
}

export function LendingTokenSelectorCard(props: Props) {
  const assetDetails = AssetsDictionary.get(props.asset);
  const isConnected = useIsConnected();

  const [amount, setAmount] = useAmountState(
    weiTo4(toWei(assetDetails.lendingLimits.min.toString())),
  );

  const weiAmount = useWeiAmount(amount);

  const { value: allowance } = useTokenAllowance(
    props.asset,
    getLendingContract(props.asset).address,
  );

  const {
    approve,
    txHash: approveTx,
    status: approveStatus,
    loading: approveLoading,
  } = useTokenApproveForLending(props.asset);

  const { lend, ...lendInfo } = useLendTokens(props.asset);

  const { lend: lendBTC, ...lendBtcInfo } = useLendTokensRBTC(props.asset);

  const handleApprove = useCallback(
    (weiAmount: string) => {
      approve(weiAmount);
    },
    [approve],
  );

  const handleLending = useCallback(
    (weiAmount: string) => {
      if (!(lendInfo.loading && lendBtcInfo.loading)) {
        if (props.asset === Asset.BTC) {
          lendBTC(weiAmount);
        } else {
          lend(weiAmount);
        }
      }
    },
    [lend, lendBTC, props.asset, lendInfo.loading, lendBtcInfo.loading],
  );

  const handleSubmit = e => {
    e.preventDefault();
    handleTx();
  };

  const handleTx = useCallback(() => {
    if (
      props.asset !== Asset.BTC &&
      bignumber(weiAmount).greaterThan(allowance)
    ) {
      handleApprove(toWei('1000000', 'ether'));
    } else {
      handleLending(weiAmount);
    }
  }, [allowance, weiAmount, handleApprove, handleLending, props]);

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

  const { value: maxAmount, loading: maxLoading } = useMaxDepositAmount(
    props.asset,
    weiAmount,
  );

  const valid = useIsAmountWithinLimits(
    weiAmount,
    toWei(assetDetails.lendingLimits.min.toString()),
    maxAmount,
  );

  const [showHistory, setShowHistory] = useState(false);
  const tooltipText =
    props.asset === 'BTC'
      ? tooltipData.lending.InterestAPR_BTC
      : tooltipData.lending.InterestAPR_USD;

  return (
    <>
      <form
        className="d-block p-5 bg-secondary text-white shadow"
        onSubmit={handleSubmit}
      >
        <div className="d-flex flex-row justify-content-center">
          <AssetLogo src={assetDetails.logoSvg} alt={props.asset} />
        </div>
        <div className="row mt-3 d-flex align-items-center">
          <div className="col-6">
            <h2>{props.asset}</h2>
          </div>
          <div className="col-6 text-right">
            <div className="text-lightGrey">
              <Tooltip content={tooltipText}>Interest APR:</Tooltip>
            </div>
            <AssetInterestRate asset={props.asset} weiAmount={weiAmount} />
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-6">
            <div>Enter deposit amount</div>
            <div className="small text-lightGrey">
              (min: {assetDetails.lendingLimits.min.toFixed(4)}, max:{' '}
              <span className={maxLoading ? 'bp3-skeleton' : ''}>
                {weiTo4(maxAmount)}
              </span>
              )
            </div>
          </div>
          <div className="col-6">
            <InputGroup
              placeholder="Amount"
              type="text"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              readOnly={txState.loading}
              rightElement={<Tag minimal>{props.asset}</Tag>}
            />
          </div>
        </div>
        <div className="mt-3 d-flex flex-row justify-content-center align-items-center overflow-hidden">
          <div className="text-center w-100">
            <button
              className="btn btn-customOrange text-white font-weight-bold"
              type="submit"
              disabled={txState.loading || !isConnected || !valid}
            >
              {`Lend ${props.asset}`}
            </button>
          </div>
          {txState.type !== TxType.NONE && (
            <SendTxProgress
              status={txState.status}
              txHash={txState.txHash}
              loading={txState.loading}
              type={txState.type}
            />
          )}
        </div>
        <LenderBalance asset={props.asset} />
        <button
          className="btn btn-customOrange text-white font-weight-bold"
          type="button"
          onClick={() => setShowHistory(true)}
          disabled={!isConnected}
        >
          Lending history
        </button>
      </form>
      <CustomDialog
        show={showHistory}
        onClose={() => setShowHistory(false)}
        title="Lending history"
        content={<LendingHistory asset={props.asset} />}
      />
    </>
  );
}

const AssetLogo = styled.img`
  height: 5rem;
`;
