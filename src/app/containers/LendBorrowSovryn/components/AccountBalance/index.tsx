import React from 'react';
import clsx from 'clsx';

import '../../assets/index.scss';

type Props = {
  currency: string;
  value: string;
};

const AccountBalance: React.FC<Props> = ({ currency, value }) => {
  return (
    <div
      className={clsx(
        'account-balance-container',
        currency === 'DOC' && 'account-balance-container__green',
      )}
    >
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
