import React from 'react';

import '../../../assets/index.scss';

type Props = {
  currency: string;
  value: string;
};

const AccountBalance: React.FC<Props> = ({ currency, value }) => {
  return (
    <div className="account-balance-container">
      <div className="account-balance">
        <p>Account Balance</p>
        <span>
          {currency} <b> {value}</b>
        </span>
      </div>
      <button>Lend {currency}</button>
    </div>
  );
};

export default AccountBalance;
