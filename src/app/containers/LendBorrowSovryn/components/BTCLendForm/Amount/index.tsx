import React from 'react';

import '../../../assets/index.scss';

type Props = {
  amountName: string;
  currency: string;
  minValue: number | string;
  maxValue: number | string;
};

const DepositAmount: React.FC<Props> = ({
  amountName,
  currency,
  minValue,
  maxValue,
}) => {
  return (
    <div className="deposit-amount-container">
      <div className="d-flex flex-column ">
        <p> {amountName}</p>
        <div className="d-flex input-container">
          <div className="flex-grow-1 data-container">
            <input
              // type="number"
              // step=".00000000000000001"
              className="d-inline-block w-100-input"
              value={''}
              placeholder="Enter amount"
              // onChange={e => props.onChangeAmount(e.currentTarget.value)}
            />
          </div>
          <div className=" mr-2 d-flex align-items-center">
            <b>MAX</b>
          </div>
        </div>
      </div>
      <div className="d-flex flex-column min-max-btc">
        <p>
          <span>Min:</span> {currency} <strong>{minValue}</strong>
        </p>
        <p>
          <span>Max:</span> {currency} <strong>{maxValue}</strong>
        </p>
      </div>
    </div>
  );
};

export default DepositAmount;
