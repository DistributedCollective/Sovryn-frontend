import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { Icon } from '@blueprintjs/core';
import {
  numberToUSD,
  toNumberFormat,
} from '../../../utils/display-text/format';
import { useSaleCalculator } from '../../containers/SalesPage/hooks/useSaleCalculator';
import { LoadableValue } from '../LoadableValue';
import { handleNumber } from '../../../utils/helpers';

const StyledSOVWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(30, 30, 30, 0.96);
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  .content-header {
    font-size: 28px;
    margin-top: 30px;
    margin-bottom: 50px;
  }
  .content-box {
    width: 320px;
    display: flex;
    flex-direction: column;
  }
  .close {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }

  .rbtc-input {
    background: white;
    text-align: center;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 20px;
    color: black;
  }
  .sov-res {
    text-align: center;
    background: #707070;
    border-radius: 8px;
    padding: 10px;
    font-size: 20px;
    margin: 10px 0 20px 0;
  }
`;
export default function SOVCalculator({ setShowCalc }) {
  const [amount, setAmount] = useState('0.05');
  const { sovToReceive, price, loading } = useSaleCalculator(amount);
  return (
    <StyledSOVWrapper>
      <p className="content-header">Calculate how much SOV you receive</p>
      <p className="close" onClick={() => setShowCalc(false)}>
        <Icon icon="cross" iconSize={35} color="white" />
      </p>
      <div className="content-box">
        <p className="mb-0">Send BTC:</p>
        <input
          className="rbtc-input"
          type="text"
          placeholder="0.00000000"
          value={amount}
          onChange={e => setAmount(handleNumber(e.currentTarget.value))}
        />
        <p className="text-center">
          <Icon icon="arrow-down" iconSize={35} />
        </p>
        <p className="mb-0">Receive SOV:</p>
        <LoadableValue
          loading={loading}
          value={
            <p className="sov-res">
              {toNumberFormat(sovToReceive)} ≈ {numberToUSD(price, 2)}
            </p>
          }
        />
      </div>
    </StyledSOVWrapper>
  );
}
