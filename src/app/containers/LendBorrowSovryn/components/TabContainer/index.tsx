import React, { useState } from 'react';
import { TransactionStatus } from 'types/transaction-status';
import { Asset } from 'types/asset';

import Amount from '../Amount';
import ButtonGroup from '../ButtonGroup';
import AccountBalance from '../AccountBalance';

import '../../assets/index.scss';

export enum TxType {
  NONE = 'none',
  APPROVE = 'approve',
  LEND = 'lend',
  WITHDRAW = 'withdraw',
  BORROW = 'borrow',
  CLOSE_WITH_DEPOSIT = 'closeWithDeposit',
}

type Props = {
  currency: Asset;
  maxValue: string;
  loadingLimit: boolean;
  minValue?: string;
  amountValue: string;
  leftButton: string;
  rightButton: string;
  onChangeAmount: (e: string) => void;
  onMaxChange: (button: string) => void;
  handleSubmit: () => void;
  handleSubmitWithdraw?: () => void;
  setBorrowAmount?: (amount: string) => void;
  handleSubmitRepay?: () => void;
  isConnected: boolean;
  valid: boolean;
  txState: {
    type: TxType;
    txHash: any;
    status: TransactionStatus;
    loading: boolean;
  };
};

const TabContainer: React.FC<Props> = ({
  currency,
  maxValue,
  minValue,
  amountValue,
  onChangeAmount,
  handleSubmit,
  handleSubmitWithdraw,
  handleSubmitRepay,
  leftButton,
  rightButton,
  isConnected,
  valid,
  txState,
  onMaxChange,
  setBorrowAmount,
  loadingLimit,
}) => {
  const [currentButton, setCurrentButton] = useState(leftButton);
  return (
    <>
      <ButtonGroup
        setCurrentButton={setCurrentButton}
        setBorrowAmount={setBorrowAmount}
        currency={currency}
        leftButton={leftButton}
        rightButton={rightButton}
      />
      <Amount
        amountValue={amountValue}
        onChangeAmount={onChangeAmount}
        onMaxChange={() => onMaxChange(currentButton)}
        currency={currency}
        amountName={
          currentButton === 'Deposit' ? 'Deposit Amount' : 'Amount to redeem'
        }
        maxValue={currentButton === 'Deposit' ? maxValue : '0'}
        loadingLimit={loadingLimit}
      />
      <AccountBalance
        title={currentButton}
        txState={txState}
        valid={valid}
        isConnected={isConnected}
        handleSubmit={handleSubmit}
        handleSubmitWithdraw={handleSubmitWithdraw}
        handleSubmitRepay={handleSubmitRepay}
        currency={currency}
      />
    </>
  );
};

export default TabContainer;
