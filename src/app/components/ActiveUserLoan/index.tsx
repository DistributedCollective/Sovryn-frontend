/**
 *
 * ActiveUserLoans
 *
 */
import React, { useState } from 'react';
import { ActiveLoan } from 'app/hooks/trading/useGetActiveLoans';
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';
import { weiTo4 } from '../../../utils/blockchain/math-helpers';
import { CloseTradingPositionHandler } from '../../containers/CloseTradingPositionHandler';

interface Props {
  item: ActiveLoan;
}

// collateral: "295874052501784628400"
// collateralToken: "0xE631653c4Dc6Fb98192b950BA0b598f90FA18B3E"
// currentMargin: "51887504175342500822"
// endTimestamp: "1600335856"
// interestDepositRemaining: "256011443817261"
// interestOwedPerDay: "9179529393280"
// loanId: "0xde1821f5678c33ca4007474735d910c0b6bb14f3fa0734447a9bd7b75eaf68ae"
// loanToken: "0xE53d858A78D884659BF6955Ea43CBA67c0Ae293F"
// maintenanceMargin: "15000000000000000000"
// maxLiquidatable: "0"
// maxLoanTerm: "2419200"
// maxSeizable: "0"
// principal: "19479815282251308"
// startMargin: "100000000000000000000"
// startRate: "131578947368421"

export function ActiveUserLoan({ item }: Props) {
  const date = (timestamp: string) =>
    new Date(Number(timestamp) * 1e3).toLocaleDateString();

  const symbolByTokenAddress = (address: string) => {
    return AssetsDictionary.getByTokenContractAddress(address)?.symbol;
  };

  const [positionCloseModalOpen, setPositionCloseModalOpen] = useState(false);

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
          <div className="col">
            <div className="font-weight-bold">Interest deposit remaining</div>
            <div>
              {weiTo4(item.interestDepositRemaining)}{' '}
              {symbolByTokenAddress(item.loanToken)}
            </div>
          </div>
          <div className="col">
            <div className="font-weight-bold">InterestOwedPerDay</div>
            <div>
              {weiTo4(item.interestOwedPerDay)}{' '}
              {symbolByTokenAddress(item.loanToken)}
            </div>
          </div>
          <div className="col">
            <div className="btn-group">
              <button className="btn btn-info" onClick={() => {}}>
                Add margin
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
    </>
  );
}
