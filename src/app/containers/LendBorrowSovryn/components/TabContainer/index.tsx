import React from 'react';
import Amount from '../Amount';
import ButtonGroup from '../ButtonGroup';
import AccountBalance from '../AccountBalance';

import '../../assets/index.scss';
import { TransactionStatus } from '../../../../../types/transaction-status';

type Props = {
  currency: string;
  amountName: string;
  maxValue: string;
  minValue: string;
  amountValue: string;
  leftButton: string;
  rightButton: string;
  accountBalanceValue: string;
  onChangeAmount: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: any) => void;
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
  leftButton,
  rightButton,
  accountBalanceValue,
  isConnected,
  valid,
  txState,
}) => {
  return (
    <div className="tabs-container">
      <ButtonGroup
        currency={currency}
        leftButton={leftButton}
        rightButton={rightButton}
      />
      <Amount
        amountValue={amountValue}
        onChangeAmount={onChangeAmount}
        currency={currency}
        amountName={amountName}
        maxValue={maxValue}
        minValue={minValue}
      />
      <AccountBalance
        loading={txState.loading}
        valid={valid}
        isConnected={isConnected}
        handleSubmit={handleSubmit}
        currency={currency}
        value={accountBalanceValue}
      />
    </div>
  );
};

export default TabContainer;
