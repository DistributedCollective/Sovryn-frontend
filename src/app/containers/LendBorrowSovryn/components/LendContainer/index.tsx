import React from 'react';
import Amount from '../Amount';
import ButtonGroup from '../ButtonGroup';
import AccountBalance from '../AccountBalance';

import '../../assets/index.scss';

type Props = {
  currency: string;
  amountName: string;
  maxValue: string;
  minValue: string;
};

const LendContainer: React.FC<Props> = ({
  currency,
  amountName,
  maxValue,
  minValue,
}) => {
  return (
    <div className="tabs-container">
      <ButtonGroup
        currency={currency}
        leftButton="Deposit"
        rightButton="Withdraw"
      />
      <Amount
        currency={currency}
        amountName={amountName}
        maxValue={maxValue}
        minValue={minValue}
      />
      <AccountBalance currency={currency} value="2.736587" />
    </div>
  );
};

export default LendContainer;
