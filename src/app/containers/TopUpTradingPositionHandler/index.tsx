/**
 *
 * TopUpTradingPositionHandler
 *
 */

import React, { useState } from 'react';
import { ActiveLoan } from '../../hooks/trading/useGetActiveLoans';
import { Dialog, InputGroup, Tag } from '@blueprintjs/core';
import { SendTxProgress } from '../../components/SendTxProgress';
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { weiTo18 } from '../../../utils/blockchain/math-helpers';
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
  const assetDetails = AssetsDictionary.getByTokenContractAddress(
    props.item.loanToken,
  );
  const tokenDetails = AssetsDictionary.getByTokenContractAddress(
    props.item.collateralToken,
  );

  const { value: balance } = useTokenBalanceOf(tokenDetails.asset);
  const [amount, setAmount] = useState(weiTo18(balance));

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
    <Dialog isOpen={props.showModal} className="bg-secondary p-3">
      <div className="container">
        <div className="d-flex flex-column align-items-center justify-content-center">
          <img
            className="mb-3"
            src={assetDetails.logoSvg}
            alt={assetDetails.asset}
            style={{ height: '5rem' }}
          />
        </div>

        <InputGroup
          className="mb-3"
          value={amount}
          onChange={e => setAmount(e.currentTarget.value)}
          rightElement={<Tag>{tokenDetails.asset}</Tag>}
        />

        <AssetWalletBalance asset={tokenDetails.asset} />

        {rest.status !== TransactionStatus.NONE && (
          <div className="mb-4">
            <SendTxProgress
              status={rest.status}
              txHash={rest.txHash}
              loading={rest.loading}
              type={rest.type}
            />
          </div>
        )}

        <div className="d-flex flex-row justify-content-end align-items-center">
          <button
            className="btn btn-link ml-3 mt-0"
            onClick={props.onCloseModal}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary ml-3 mt-0"
            disabled={rest.loading || !valid}
            onClick={() => handleConfirm()}
          >
            TOP UP {tokenDetails.asset}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
