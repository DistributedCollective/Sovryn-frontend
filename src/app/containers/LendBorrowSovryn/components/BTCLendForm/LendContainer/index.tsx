import React from 'react';
import '../../../assets/index.scss';
import DepositAmount from '../Amount';
import ButtonGroup from '../ButtonGroup';
import AccountBalance from '../AccountBalance';

type Props = {};

const LendContainer: React.FC<Props> = props => {
  return (
    <div className="lend-container">
      <ButtonGroup leftButton="Deposit" rightButton="Withdraw" />
      <DepositAmount
        currency="BTC"
        amountName="Deposit Amount"
        maxValue="119.8648"
        minValue="0.0100"
      />
      <AccountBalance currency="BTC" value="2.736587" />
    </div>
  );
};

export default LendContainer;
