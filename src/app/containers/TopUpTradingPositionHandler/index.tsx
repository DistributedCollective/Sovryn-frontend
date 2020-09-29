/**
 *
 * TopUpTradingPositionHandler
 *
 */

import React, { useState } from 'react';
import { ActiveLoan } from '../../hooks/trading/useGetActiveLoans';
import { Dialog, InputGroup } from '@blueprintjs/core';
import { SendTxProgress } from '../../components/SendTxProgress';
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { TransactionStatus } from '../../../types/transaction-status';
import { AssetWalletBalance } from '../../components/AssetWalletBalance';
import { useTokenBalanceOf } from '../../hooks/useTokenBalanceOf';
import { useIsAmountWithinLimits } from '../../hooks/useIsAmountWithinLimits';
import { useApproveAndAddMargin } from '../../hooks/trading/useApproveAndAndMargin';

interface Props {
  item: ActiveLoan;
  showModal: boolean;
  onCloseModal: () => void;
}

export function TopUpTradingPositionHandler(props: Props) {
  const tokenDetails = AssetsDictionary.getByTokenContractAddress(
    props.item.collateralToken,
  );
  const color = tokenDetails.asset === 'BTC' ? 'customTeal' : 'Gold';
  const { value: balance } = useTokenBalanceOf(tokenDetails.asset);
  const [amount, setAmount] = useState();

  const weiAmount = useWeiAmount(amount);

  const { send, ...rest } = useApproveAndAddMargin(
    tokenDetails.asset,
    props.item.loanId,
    weiAmount,
  );

  const handleConfirm = () => {
    send();
  };

  const valid = useIsAmountWithinLimits(weiAmount, '1', balance);

  return (
    <Dialog
      isOpen={props.showModal}
      className={`bg-component-bg p-3 border border-${color}`}
    >
      <div className="container position-relative">
        <div
          className="position-absolute"
          style={{ top: '0', right: '0', fontSize: '12px', cursor: 'pointer' }}
          onClick={props.onCloseModal}
        >
          <u>Close</u> X
        </div>

        <div className={`text-${color} text-center mt-4 modal-title`}>
          Top Up position
        </div>

        <div className="row mt-3">
          <div className="col-4">
            <div className="data-label">Currency</div>
            <div className="data-container p-2">
              <div>{tokenDetails.asset}</div>
            </div>
          </div>
          <div className="col-8">
            <div className="data-label">Top Up Amount</div>
            <div className="data-container">
              <InputGroup
                value={amount || ''}
                onChange={e => setAmount(e.currentTarget.value)}
                placeholder="Enter amount"
              />
            </div>
          </div>
        </div>
        <div className="row mt-3 mb-4">
          <div className="col-6">
            <AssetWalletBalance asset={tokenDetails.asset} />
          </div>
          <div className="col-6">
            <div>
              <button
                className={`btn btn-${color} text-white my-3 w-100 p-2 rounded`}
                disabled={rest.loading || !valid}
                onClick={() => handleConfirm()}
              >
                Top Up
              </button>
            </div>
          </div>
        </div>

        {rest.status !== TransactionStatus.NONE && (
          <div className="row">
            <SendTxProgress
              status={rest.status}
              txHash={rest.txHash}
              loading={rest.loading}
              type={rest.type}
              displayAbsolute={false}
            />
          </div>
        )}
      </div>
    </Dialog>
  );
}
