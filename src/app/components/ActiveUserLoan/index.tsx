/**
 *
 * ActiveUserLoans
 *
 */
import React, { useState } from 'react';
import { ActiveLoan } from 'app/hooks/trading/useGetActiveLoans';
import { weiTo4 } from '../../../utils/blockchain/math-helpers';
import { CloseTradingPositionHandler } from '../../containers/CloseTradingPositionHandler';
import { TopUpTradingPositionHandler } from '../../containers/TopUpTradingPositionHandler';
import { symbolByTokenAddress } from '../../../utils/blockchain/contract-helpers';

interface Props {
  item: ActiveLoan;
}

export function ActiveUserLoan({ item }: Props) {
  const date = (timestamp: string) =>
    new Date(Number(timestamp) * 1e3).toLocaleDateString();

  const [positionCloseModalOpen, setPositionCloseModalOpen] = useState(false);
  const [positionMarginModalOpen, setPositionMarginModalOpen] = useState(false);

  return (
    <>
      <div className="container bg-secondary py-3 mb-3">
        <div className="row mb-3">
          <div className="col">
            <div className="font-weight-bold">Loan Token</div>
            <div>{symbolByTokenAddress(item.loanToken)}</div>
          </div>
          <div className="col">
            <div className="font-weight-bold">Collateral Token</div>
            <div>{symbolByTokenAddress(item.collateralToken)}</div>
          </div>
          {/*<div className="col">*/}
          {/*  <div className="font-weight-bold">Interest deposit remaining</div>*/}
          {/*  <div>*/}
          {/*    {weiTo4(item.interestDepositRemaining)}{' '}*/}
          {/*    {symbolByTokenAddress(item.loanToken)}*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div className="col">
            <div className="font-weight-bold">Borrowed amount</div>
            <div>
              {weiTo4(item.principal)} {symbolByTokenAddress(item.loanToken)}
            </div>
          </div>
          <div className="col">
            <div className="font-weight-bold">Position size</div>
            <div>
              {weiTo4(item.collateral)}{' '}
              {symbolByTokenAddress(item.collateralToken)}
            </div>
          </div>
          {/*<div className="col">*/}
          {/*  <div className="font-weight-bold">InterestOwedPerDay</div>*/}
          {/*  <div>*/}
          {/*    {weiTo4(item.interestOwedPerDay)}{' '}*/}
          {/*    {symbolByTokenAddress(item.loanToken)}*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div className="col">
            <div className="btn-group">
              <button
                className="btn btn-info"
                onClick={() => setPositionMarginModalOpen(true)}
              >
                Top-Up
              </button>
              <button
                className="btn btn-danger"
                onClick={() => setPositionCloseModalOpen(true)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="font-weight-bold">Start Rate</div>
            <div>{weiTo4(item.startRate)}%</div>
          </div>
          <div className="col">
            <div className="font-weight-bold">Start Margin</div>
            <div>{weiTo4(item.startMargin)}%</div>
          </div>
          <div className="col">
            <div className="font-weight-bold">Maintenance Margin</div>
            <div>{weiTo4(item.maintenanceMargin)}%</div>
          </div>
          <div className="col">
            <div className="font-weight-bold">Current Margin</div>
            <div>{weiTo4(item.currentMargin)}%</div>
          </div>
          <div className="col">
            <div className="font-weight-bold">End date</div>
            <div>{date(item.endTimestamp)}</div>
          </div>
        </div>
      </div>
      <CloseTradingPositionHandler
        item={item}
        showModal={positionCloseModalOpen}
        onCloseModal={() => setPositionCloseModalOpen(false)}
      />
      <TopUpTradingPositionHandler
        item={item}
        showModal={positionMarginModalOpen}
        onCloseModal={() => setPositionMarginModalOpen(false)}
      />
    </>
  );
}
