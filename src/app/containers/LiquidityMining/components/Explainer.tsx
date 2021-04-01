import React from 'react';
import styled from 'styled-components';

export function Explainer() {
  return (
    <>
      <div className="font-family-montserrat">
        <p className="text-white font-weight-bold mt-3">
          <u style={{ textUnderlinePosition: 'under' }}>
            Earn SOV by depositing liquidity into the USDT/BTC liquidity pool
          </u>
        </p>
        <p>
          Start date: 1st April 2021, 12.00 UTC
          <br />
          End date: 1st May 2021, 12.00 UTC
        </p>
        <p>
          Reward pool for depositing USDT: 25,000 SOV
          <br />
          Reward pool for depositing RBTC: 25,000 SOV
        </p>
        <p>
          Your share of the pool is calculated by:
          <div className="w-100 text-center text-white mt-2">
            liquidity added by you * number of blocks held
          </div>
          <Line></Line>
          <div className="w-100 text-center text-white">
            total liquidity added * number of blocks held
          </div>
        </p>
      </div>
    </>
  );
}

const Line = styled.div`
  background-color: white;
  width: 400px;
  height: 1px;
  margin: 0 auto;
`;
