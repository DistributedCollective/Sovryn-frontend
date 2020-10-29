/**
 *
 * CloseTradingPositionHandler
 *
 */

import React, { useEffect, useState } from 'react';
import { ActiveLoan } from '../../hooks/trading/useGetActiveLoans';
import { FormSelect } from '../../components/FormSelect';
import { SendTxProgress } from '../../components/SendTxProgress';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { useCloseWithSwap } from '../../hooks/protocol/useCloseWithSwap';
import { useAccount } from '../../hooks/useAccount';
import { weiTo18 } from '../../../utils/blockchain/math-helpers';
import { symbolByTokenAddress } from '../../../utils/blockchain/contract-helpers';
import { useIsAmountWithinLimits } from '../../hooks/useIsAmountWithinLimits';
import { Dialog } from '../Dialog/Loadable';
import { DummyField } from '../../components/DummyField';
import { AmountField } from '../AmountField';
import { DialogButton } from '../../components/DialogButton';
import { AssetWalletBalance } from '../../components/AssetWalletBalance';
import { Asset } from '../../../types/asset';
import { TransactionStatus } from '../../../types/transaction-status';

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
    <Dialog isOpen={props.showModal} onClose={() => props.onCloseModal()}>
      <div className="container position-relative">
        <h4 className="text-teal text-center mb-5 text-uppercase">
          {!!props.item.loanId ? 'Liquidate position' : 'Position liquidated'}
        </h4>

        {!!props.item.loanId && (
          <>
            <div className="row d-flex flex-row flex-nowrap align-items-center">
              <div className="col-4 col-lg-4 flex-grow-0 text-muted">
                Position size
              </div>
              <div className="col flex-grow-1">
                <DummyField>
                  <span className="d-flex w-100 flex-row justify-content-between align-items-center">
                    <span>{weiTo18(props.item.collateral)}</span>
                    <span className="text-muted">
                      {symbolByTokenAddress(props.item.collateralToken)}
                    </span>
                  </span>
                </DummyField>
              </div>
            </div>

            <div className="mt-3 text-muted">Withdraw in</div>
            <div className="row mt-1 d-flex flex-row flex-nowrap align-items-center">
              <div className="col-4 col-lg-4 flex-grow-0">
                <FormSelect
                  filterable={false}
                  items={options}
                  onChange={item => setIsCollateral(item.key)}
                  value={isCollateral}
                />
              </div>
              <div className="col flex-grow-1 flex-shrink-0">
                <AmountField
                  value={amount || ''}
                  onChange={value => setAmount(value)}
                  onMaxClicked={() => setAmount(weiTo18(props.item.collateral))}
                />
              </div>
            </div>
          </>
        )}

        {rest.status !== TransactionStatus.NONE && (
          <SendTxProgress
            {...rest}
            type={'trade_close'}
            displayAbsolute={false}
          />
        )}

        {!!props.item.loanId && (
          <div className="mt-4 d-flex flex-row justify-content-between">
            <AssetWalletBalance asset={Asset.BTC} />
            <DialogButton
              text={withdrawAll ? 'Close Position' : 'Close Amount'}
              onClick={() => handleConfirmSwap()}
              disabled={rest.loading || !valid}
              loading={rest.loading}
            />
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
