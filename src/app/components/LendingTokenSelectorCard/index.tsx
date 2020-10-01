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
// import { useMaxDepositAmount } from '../../hooks/lending/useMaxDepositAmount';
import { weiTo4 } from '../../../utils/blockchain/math-helpers';
// import { useIsAmountWithinLimits } from '../../hooks/useIsAmountWithinLimits';
import { CustomDialog } from '../CustomDialog';
import { LendingHistory } from '../../containers/LendingHistory';

import tooltipData from 'utils/data/tooltip-text.json';
import { useLendTokens } from '../../hooks/useLendTokens';
import { handleNumberInput } from '../../../utils/helpers';

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

  const [amount, setAmount] = useState(
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

  // const { value: maxAmount, loading: maxLoading } = useMaxDepositAmount(
  //   props.asset,
  //   weiAmount,
  // );

  // const valid = useIsAmountWithinLimits(
  //   weiAmount,
  //   toWei(assetDetails.lendingLimits.min.toString()),
  //   maxAmount,
  // );

  const [showHistory, setShowHistory] = useState(false);
  const tooltipText =
    props.asset === 'BTC'
      ? tooltipData.lending.InterestAPR_BTC
      : tooltipData.lending.InterestAPR_USD;

  return (
    <>
      <form
        className="d-block bg-component-bg text-white shadow"
        onSubmit={handleSubmit}
      >
        <div className="d-flex flex-row justify-content-center p-3 pt-5">
          <AssetLogo src={assetDetails.logoSvg} alt={props.asset} />
        </div>
        <div className="row mt-3 d-flex align-items-center py-2 px-5 mb-3">
          <div className="col-6">
            <h2>{props.asset}</h2>
          </div>
          <div className="col-6 text-right p-0">
            <div className="text-MediumGrey data-label">
              <Tooltip content={tooltipText}>Interest APR:</Tooltip>
            </div>
            <div className="data-container">
              <AssetInterestRate asset={props.asset} weiAmount={weiAmount} />
            </div>
          </div>
        </div>
        <div className="position-relative h-100 w-100">
          <div className="row py-2 px-5">
            <div className="col-6 text-MediumGrey">
              <div>Enter deposit amount</div>
            </div>
            <div className="col-6 data-container">
              <InputGroup
                placeholder="Amount"
                type="text"
                value={amount}
                onChange={e => setAmount(handleNumberInput(e))}
                readOnly={txState.loading}
                rightElement={
                  <Tag minimal className="text-white">
                    {props.asset}
                  </Tag>
                }
              />
            </div>
          </div>
          <div className="small text-MediumGrey row py-2 px-5 mb-5"></div>
          <div className="mb-5">
            <div className="text-center w-100">
              <button
                className="btn btn-customTeal rounded text-white"
                type="submit"
                disabled={txState.loading || !isConnected}
                // disabled={txState.loading || !isConnected || !valid}
              >
                {`Lend ${props.asset}`}
              </button>
            </div>
          </div>
          <div className="p-2" />
          {txState.type !== TxType.NONE && (
            <SendTxProgress
              status={txState.status}
              txHash={txState.txHash}
              loading={txState.loading}
              type={txState.type}
            />
          )}
        </div>
      </form>
      <div className="bg-component-bg align-items-center mt-3 p-5 text-center">
        {isConnected && <LenderBalance asset={props.asset} />}
        <button
          className="btn btn-customTeal rounded text-white"
          type="button"
          onClick={() => setShowHistory(true)}
          disabled={!isConnected}
        >
          Lending history
        </button>

        <CustomDialog
          show={showHistory}
          onClose={() => setShowHistory(false)}
          title="Lending history"
          content={<LendingHistory asset={props.asset} />}
        />
      </div>
    </>
  );
}

const AssetLogo = styled.img`
  height: 5rem;
`;
