import React, { useState } from 'react';
import Amount from '../Amount';
import ButtonGroup from '../ButtonGroup';
import AccountBalance from '../AccountBalance';
import { TransactionStatus } from '../../../../../types/transaction-status';

import '../../assets/index.scss';

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
  handleSubmit: (e: any) => void;
  handleSubmitWithdraw?: (e: any) => void;
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
  leftButton,
  rightButton,
  isConnected,
  valid,
  txState,
  onMaxChange,
}) => {
  const [currentButton, setCurrentButton] = useState(leftButton);
  return (
    <div className="tabs-container">
      <ButtonGroup
        setCurrentButton={setCurrentButton}
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
        currency={currency}
      />
    </div>
  );
};

export default TabContainer;
