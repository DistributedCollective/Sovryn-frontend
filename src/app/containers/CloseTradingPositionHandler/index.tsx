/**
 *
 * CloseTradingPositionHandler
 *
 */

import React, { useState } from 'react';
import { ActiveLoan } from '../../hooks/trading/useGetActiveLoans';
import { Dialog, InputGroup } from '@blueprintjs/core';
// import { CloseTradingPositionForm } from '../../components/CloseTradingPositionForm';
import { FormSelect } from '../../components/FormSelect';
import { SendTxProgress } from '../../components/SendTxProgress';
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { useCloseWithSwap } from '../../hooks/bzx/useCloseWithSwap';
import { useAccount } from '../../hooks/useAccount';

interface Props {
  item: ActiveLoan;
  showModal: boolean;
  onCloseModal: () => void;
}

const getOptions = (item: ActiveLoan) => {
  const loan = AssetsDictionary.getByTokenContractAddress(item.loanToken);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const collateral = AssetsDictionary.getByTokenContractAddress(
    item.collateralToken,
  );

  if (loan.asset) {
    //
  }

  return [
    { key: true, label: 'Withdraw in collateral tokens' },
    { key: false, label: 'Withdraw in loan tokens' },
  ];
};

export function CloseTradingPositionHandler(props: Props) {
  const assetDetails = AssetsDictionary.getByTokenContractAddress(
    props.item.loanToken,
  );

  const receiver = useAccount();

  const [amount, setAmount] = useState(props.item.interestDepositRemaining);
  const [isCollateral, setIsCollateral] = useState(false);
  const [options] = useState(getOptions(props.item));

  const weiAmount = useWeiAmount(amount);

  const { send, ...rest } = useCloseWithSwap(
    props.item.loanId,
    receiver,
    weiAmount,
    isCollateral,
    '0x',
  );

  const handleConfirmSwap = () => {
    send();
  };

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

        <div className="d-flex flex-row justify-content-between">
          <div className="flex-grow-1 mr-3">
            <InputGroup
              className="mb-3"
              value={amount}
              onChange={e => setAmount(e.currentTarget.value)}
            />
          </div>
          <div>
            <FormSelect
              filterable={false}
              items={options}
              onChange={item => setIsCollateral(item.key)}
              value={isCollateral}
            />
          </div>
        </div>

        <div className="mb-4">
          <SendTxProgress
            status={rest.status}
            txHash={rest.txHash}
            loading={rest.loading}
          />
        </div>

        <div className="d-flex flex-row justify-content-end align-items-center">
          <button
            className="btn btn-link ml-3 mt-0"
            onClick={props.onCloseModal}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary ml-3 mt-0"
            disabled={rest.loading}
            onClick={() => handleConfirmSwap()}
          >
            Withdraw
          </button>
        </div>
      </div>
    </Dialog>
  );
}
