/**
 *
 * CloseTradingPositionHandler
 *
 */

import React, { useState } from 'react';
import { ActiveLoan } from '../../hooks/trading/useGetActiveLoans';
import { Dialog, InputGroup } from '@blueprintjs/core';
import { FormSelect } from '../../components/FormSelect';
import { SendTxProgress } from '../../components/SendTxProgress';
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { useCloseWithSwap } from '../../hooks/protocol/useCloseWithSwap';
import { useAccount } from '../../hooks/useAccount';
import { weiTo18 } from '../../../utils/blockchain/math-helpers';
import { symbolByTokenAddress } from '../../../utils/blockchain/contract-helpers';
import { useIsAmountWithinLimits } from '../../hooks/useIsAmountWithinLimits';

interface Props {
  item: ActiveLoan;
  showModal: boolean;
  onCloseModal: () => void;
}

const getOptions = (item: ActiveLoan) => {
  // const loan = AssetsDictionary.getByTokenContractAddress(item.loanToken);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const collateral = AssetsDictionary.getByTokenContractAddress(
    item.collateralToken,
  );

  // if (loan.asset) {
  //   //
  // }

  return [
    { key: true, label: symbolByTokenAddress(item.collateralToken) },
    { key: false, label: symbolByTokenAddress(item.loanToken) },
  ];
};

export function CloseTradingPositionHandler(props: Props) {
  const receiver = useAccount();

  const [amount, setAmount] = useState(weiTo18(props.item.collateral));
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

  const valid = useIsAmountWithinLimits(weiAmount, '1', props.item.collateral);

  const withdrawAll = amount === weiTo18(props.item.collateral);

  return (
    <Dialog
      isOpen={props.showModal}
      className="bg-component-bg p-3 border border-Red"
    >
      <div className="container position-relative">
        <div
          className="position-absolute"
          style={{ top: '0', right: '0', fontSize: '12px', cursor: 'pointer' }}
          onClick={props.onCloseModal}
        >
          <u>Close</u> X
        </div>

        <div className="text-Red text-center mt-4 modal-title">
          Liquidate position
        </div>

        <div className="row mt-3">
          <div className="col-4">
            <div className="data-label">Position Size</div>
          </div>
          <div className="col-8">
            <div className="data-container">
              {weiTo18(props.item.collateral)}
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-4">
            <div className="data-label">Withdraw in</div>
            <div className="data-container">
              <FormSelect
                filterable={false}
                items={options}
                onChange={item => setIsCollateral(item.key)}
                value={isCollateral}
              />
            </div>
          </div>
          <div className="col-8">
            <div className="data-label">Withdraw amount</div>
            <div className="data-container">
              <InputGroup
                value={amount}
                onChange={e => setAmount(e.currentTarget.value)}
              />
            </div>
          </div>
        </div>

        {/* To do */}
        <div className="mb-4">
          <SendTxProgress
            status={rest.status}
            txHash={rest.txHash}
            loading={rest.loading}
            displayAbsolute={false}
          />
        </div>

        <div className="row">
          <div className="col-6"></div>
          <div className="col-6">
            <button
              className={`btn btn-customTeal text-${
                withdrawAll ? 'Red' : 'white'
              } my-3 w-100 p-2 rounded`}
              disabled={rest.loading || !valid}
              onClick={() => handleConfirmSwap()}
            >
              {withdrawAll ? 'Close Position' : 'Withdraw'}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
