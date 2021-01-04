import React, { useState } from 'react';
import { Tab } from '../../components/SalesTab';
import styled, { css } from 'styled-components';
import SalesButton from '../../components/SalesButton';
import { media } from '../../../styles/media';
import { Icon } from '@blueprintjs/core';

interface StyledProps {
  background?: string;
}

const Wrapper = styled.div`
  width: 320px;
  ${(props: StyledProps) =>
    props.background &&
    css`
      background: ${props.background};
    `}
  border-radius: 0 0 10px 10px;
  .qr-wrapper {
    background: white;
    border-radius: 10px;
    margin: 0;
    svg {
      width: 180px;
      height: 180px;
    }
    .btc-add-clipboard {
      padding: 15px;
      font-size: 14px;
      margin-top: 30px;
      margin-bottom: 30px;
      display: block;
      border-radius: 5px;
      background: #2d2d2d;
    }
  }
  .show-tx {
    display: flex;
    background: #363636;
    padding: 20px;
    border-radius: 10px;
    justify-content: space-evenly;
  }
  .gas-fee {
    border-bottom: 1px solid grey;
    border-top: 1px solid grey;
    padding: 1em 0;
    justify-content: center;
    text-align: center;
    font-size: 14px;
  }
  .rbtc-input {
    background: white;
    text-align: center;
    border-radius: 8px;
    padding: 10px;
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

const WrapperContainer = styled.div`
  padding: 20px 30px;
  font-size: 14px;
  color: #d9d9d9;
  border-radius: 0 10px 10px 0;
  .time {
    font-size: 16px;
  }
  .amount {
    font-size: 18px;
  }
`;

const StyledButton = styled.button.attrs(_ => ({
  type: 'button',
}))`
  border: none;
  background: #4ecdc4;
  color: white;
  height: 48px;
  text-align: center;
  ${media.xl`
    height: 50px;
    padding: 2px 20px;
    border-radius: 8px;
    font-weight: 600;
  
    &:hover, &:active, &:focus {
      background: none !important;
      color: #4ECDC4 !important;
      border: 1px solid #4ECDC4;
    }
    `}
`;

function TransactionDetail() {
  const [activeTx, setActiveTx] = useState(true);

  return (
    <div>
      <p className="content-header">Transaction Details</p>
      <div className="row no-gutters">
        <div className="col-md-6">
          <div className="mb-2">
            Your purchase of SOV is made up of 2 transactions. First it is sent
            to the address, where it is instantly converted to RBTC for you. The
            RBTC then automatically purchases the SOV and credits it to your
            wallet. You can easily view the details of each transaction and
            verify them with a block explorer.
          </div>
          <div className="mb-2">
            You will be notified when your transaction has processed.
          </div>
          <div className="mb-5">
            While you wait for your transaction to process, we suggest that you
            add SOV token to your wallet. Click to follow our simple tutorial.
          </div>
          <SalesButton text={'Connect SOV to your wallet'} onClick={() => {}} />
        </div>
        <div className="col-md-6 d-flex flex-column align-items-end">
          <div className="d-flex">
            <Tab
              text={'BTC > RBTC'}
              active={activeTx}
              background="#242424"
              opacity={0.75}
              onClick={() => setActiveTx(true)}
            >
              {'BTC > RBTC'}
            </Tab>
            <Tab
              text={'RBTC > SOV'}
              active={!activeTx}
              background="#242424"
              opacity={0.75}
              onClick={() => setActiveTx(false)}
            >
              {'BTC > RBTC'}
            </Tab>
          </div>

          <Wrapper background="#242424">
            {activeTx ? (
              <WrapperContainer>
                <p className="font-italic time font-weight-light">
                  Processing approx. 15 minuets
                </p>
                <p className="text-center amount">0.18579 BTC</p>
                <p className="text-center font-weight-light">≈ $2947.24</p>
                <p className="text-center">
                  Fee:<span className="font-weight-light">0.000012 BTC</span>{' '}
                </p>
                <p className="mb-2">From wallet:</p>
                <p className="font-weight-light">3K6RWTPM……sXwLXnPM</p>
                <p className="mb-2">To wallet:</p>
                <p className="font-weight-light">1A1zP1eP……v7DivfNa</p>
                <p>
                  Hash:{' '}
                  <span className="font-weight-light">5043e06ba……65547033</span>
                </p>
                <a className="d-block text-center">View in Tracker </a>
              </WrapperContainer>
            ) : (
              <WrapperContainer>
                <p className="font-italic time font-weight-light">
                  Processing approx. 5 minuets
                </p>
                <p className="text-center amount">0.18579 BTC</p>
                <p className="text-center font-weight-light">≈ $2947.24</p>
                <p className="text-center">
                  Fee:<span className="font-weight-light">0.000012 BTC</span>{' '}
                </p>
                <p className="mb-2">From wallet:</p>
                <p className="font-weight-light">3K6RWTPM……sXwLXnPM</p>
                <p className="mb-2">To wallet:</p>
                <p className="font-weight-light">1A1zP1eP……v7DivfNa</p>
                <p>
                  Hash:{' '}
                  <span className="font-weight-light">5043e06ba……65547033</span>
                </p>
                <a className="d-block text-center">View in Tracker </a>
              </WrapperContainer>
            )}
          </Wrapper>
        </div>
      </div>
    </div>
  );
}

export default function SendRBTC() {
  const [showTx, setShowTx] = useState(false);

  return !showTx ? (
    <div>
      <p className="content-header">Buy SOV with RBTC</p>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-4">
            <p className="mb-2">Deposit limits:</p>
            <li>MIN: 0.001 BTC</li>
            <li>MAX: 0.1 BTC</li>
            <a>Request higher limit</a>
          </div>
          <div>
            <p>Instructions: </p>
            <div>
              <li>Buy SOV with RBTC in your engaged wallet</li>
              <li>Please allow up to xx mins for the transaction to process</li>
            </div>

            <p>
              For support please join us on <a>discord.com/invite/J22WS6z</a>
            </p>
          </div>
        </div>
        <div className="col-md-6 d-flex justify-content-end">
          <Wrapper className="d-flex flex-column">
            <p className="mb-0">Send BTC:</p>
            <input
              className="rbtc-input"
              type="text"
              placeholder="0.00000000"
            />
            <p className="text-right font-sale-sm">
              Available Balance: 0.529409276 RBTC
            </p>
            <p className="gas-fee">Estimated Gas Fee*: ≈ 0.00 GWEI</p>
            <p className="text-center">
              <Icon icon="arrow-down" iconSize={35} />
            </p>
            <p className="mb-0">Receive SOV:</p>
            <p className="sov-res">120,000.00 ≈ $1000.00</p>

            <StyledButton onClick={() => setShowTx(true)}>BUY SOV</StyledButton>
          </Wrapper>
        </div>
      </div>
    </div>
  ) : (
    <TransactionDetail />
  );
}
