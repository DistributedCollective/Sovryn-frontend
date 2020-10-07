/**
 *
 * CloseTradingPositionHandler
 *
 */

import React, { useState, useEffect } from 'react';
import { Dialog } from '@blueprintjs/core';
import { ActiveLoan } from '../../hooks/trading/useGetActiveLoans';
import { FormSelect } from '../../components/FormSelect';
import { SendTxProgress } from '../../components/SendTxProgress';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { useCloseWithSwap } from '../../hooks/protocol/useCloseWithSwap';
import { useAccount } from '../../hooks/useAccount';
import { weiTo18 } from '../../../utils/blockchain/math-helpers';
import { symbolByTokenAddress } from '../../../utils/blockchain/contract-helpers';
import { useIsAmountWithinLimits } from '../../hooks/useIsAmountWithinLimits';
import { handleNumberInput } from '../../../utils/helpers';

interface Props {
  item: ActiveLoan;
  showModal: boolean;
  onCloseModal: () => void;
}

const getOptions = (item: ActiveLoan) => {
  if (!item.collateralToken || !item.loanToken) {
    return [];
  }
  return [
    { key: true, label: symbolByTokenAddress(item.collateralToken) },
    { key: false, label: symbolByTokenAddress(item.loanToken) },
  ];
};

export function CloseTradingPositionHandler(props: Props) {
  const receiver = useAccount();

  const [amount, setAmount] = useState<string>();
  const [isCollateral, setIsCollateral] = useState(false);
  const [options] = useState(getOptions(props.item));

  useEffect(() => {
    setAmount(weiTo18(props.item.collateral));
  }, [props.item.collateral]);

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

        <div className="text-customTeal text-center mt-4 modal-title">
          {!!props.item.loanId ? 'Liquidate position' : 'Position liquidated'}
        </div>

        {!!props.item.loanId && (
          <>
            <div className="d-flex flex-row mt-3">
              <div className="">
                <div className="data-label">Position Size</div>
              </div>
              <div className="flex-grow-1 mx-2">
                <div className="data-container">
                  {weiTo18(props.item.collateral)}
                </div>
              </div>
              <div className="data-container">
                {symbolByTokenAddress(props.item.collateralToken)}
              </div>
            </div>
            <div className="d-flex flex-row mt-3">
              <div className="data-label">Withdraw in</div>
              <div className="data-label flex-grow-1 mx-3">Withdraw amount</div>
            </div>
            <div className="d-flex flex-row mt-0 mb-2">
              <div className="data-container py-0 d-flex align-items-center">
                <FormSelect
                  filterable={false}
                  items={options}
                  onChange={item => setIsCollateral(item.key)}
                  value={isCollateral}
                />
              </div>
              <div className="flex-grow-1 mx-2">
                <div className="data-container">
                  <input
                    className="w-100"
                    value={amount}
                    onChange={e => setAmount(handleNumberInput(e))}
                    placeholder="Enter amount"
                  />
                </div>
              </div>
              <div className="data-container">
                {symbolByTokenAddress(props.item.collateralToken)}
              </div>
            </div>
            <div className="row">
              <button
                className="btn btn-small text-sm btn-TabGrey ml-auto mr-3"
                onClick={() => setAmount(weiTo18(props.item.collateral))}
              >
                MAX
              </button>
            </div>
          </>
        )}

        {/* To do */}
        <div className="mb-4">
          <SendTxProgress
            status={rest.status}
            txHash={rest.txHash}
            loading={rest.loading}
            type={'trade_close'}
            displayAbsolute={false}
          />
        </div>

        {!!props.item.loanId && (
          <div className="row">
            <div className="col-6" />
            <div className="col-6">
              <button
                className="btn btn-customTeal text-white my-3 w-100 p-2 rounded"
                disabled={rest.loading || !valid}
                onClick={() => handleConfirmSwap()}
              >
                {withdrawAll ? 'Close Amount' : 'Withdraw Amount'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}

CloseTradingPositionHandler.defaultProps = {
  item: {
    collateral: '0',
  },
};
