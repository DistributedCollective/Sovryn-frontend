import React, { useState } from 'react';
import Amount from '../Amount';
import ButtonGroup from '../ButtonGroup';
import AccountBalance from '../AccountBalance';
import { TransactionStatus } from '../../../../../types/transaction-status';

import '../../assets/index.scss';

export enum TxType {
  NONE = 'none',
  APPROVE = 'approve',
  LEND = 'lend',
  WITHDRAW = 'withdraw',
  BORROW = 'borrow',
}

type Props = {
  currency: string;
  amountName: string;
  maxValue: string;
  minValue?: string;
  amountValue: string;
  leftButton: string;
  rightButton: string;
  onChangeAmount: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMaxChange: (max: string) => void;
  setBorrowAmount?: (amount: string) => void;
  handleSubmit: (e: any) => void;
  handleSubmitWithdraw?: (e: any) => void;
  handleSubmitRepay?: (e: any) => void;
  isConnected: boolean;
  valid: boolean;
  txState: {
    txHash: string;
    status: TransactionStatus;
    loading: boolean;
  };
};

const TabContainer: React.FC<Props> = ({
  currency,
  amountName,
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
}) => {
  const [currentButton, setCurrentButton] = useState(leftButton);
  return (
    <div className="tabs-container">
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
        onMaxChange={onMaxChange}
        currency={currency}
        amountName={amountName}
        maxValue={maxValue}
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
    </div>
  );
};

export default TabContainer;
