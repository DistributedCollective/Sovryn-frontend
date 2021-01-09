import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import SalesButton from '../../components/SalesButton';
import { media } from '../../../styles/media';
import { Icon } from '@blueprintjs/core';
import { fromWei, trimZero } from 'utils/blockchain/math-helpers';
import { useDispatch } from 'react-redux';
import { actions as sActions } from '../SalesPage/slice';
import { selectSalesPage } from '../SalesPage/selectors';
import { useSelector } from 'react-redux';
import { Sovryn } from 'utils/sovryn';
import { useAccount } from 'app/hooks/useAccount';
import { useBalance } from 'app/hooks/useBalance';
import { toWei } from 'utils/blockchain/math-helpers';

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
  border-radius: 10px;
  .header {
    display: flex;
    justify-content: center;
    padding: 10px 0;
    border-bottom: 1px solid #383838;
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
  .content {
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
          <Wrapper background="#242424">
            <div className="header">(r)BTC &gt; SOV</div>
            <div className="content">
              <p className="font-italic time font-weight-light">
                Processing approx. 5 minuets
              </p>
              <p className="text-center amount">0.18579 (r)BTC</p>
              <p className="text-center font-weight-light">≈ $2947.24</p>
              <p className="text-center">
                Fee:<span className="font-weight-light">0.000012 (r)BTC</span>{' '}
              </p>
              <p className="mb-2">From wallet:</p>
              <p className="font-weight-light">3K6RWTPM……sXwLXnPM</p>
              <p className="mb-2">To wallet:</p>
              <p className="font-weight-light">1A1zP1eP……v7DivfNa</p>
              <p>
                Hash:{' '}
                <span className="font-weight-light">5043e06ba……65547033</span>
              </p>
            </div>
          </Wrapper>
        </div>
      </div>
    </div>
  );
}

export default function SendRBTC() {
  const [showTx, setShowTx] = useState(false);
  const dispatch = useDispatch();
  const { maxDeposit } = useSelector(selectSalesPage);
  const account = useAccount();
  const { value: balance } = useBalance();

  const [amount, setAmount] = useState('0');

  const handleBuy = () => {
    setShowTx(true);
    console.log(Sovryn.contracts['CrowdSale'].methods.buy());
    Sovryn.contracts['CrowdSale'].methods
      .buy()
      .send({ from: account, value: toWei(amount) })
      .on('receipt', function (receipt) {
        // receipt example
        console.log(receipt);
      })
      .on('error', function (error, receipt) {
        console.log(error);
      });
  };

  return !showTx ? (
    <div>
      <p className="content-header">Buy SOV with (r)BTC</p>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-4">
            <p className="mb-2">Deposit limits:</p>
            <li>MIN: {trimZero(fromWei(maxDeposit / 2))} (r)BTC</li>
            <li>MAX: {trimZero(fromWei(maxDeposit))} (r)BTC</li>
            <a
              href="/sales#"
              className="d-block"
              onClick={e => {
                e.preventDefault();
                dispatch(sActions.changeStep(3));
              }}
            >
              Input upgrade code
            </a>
            <a
              href="/sales#"
              className="d-block"
              onClick={e => {
                e.preventDefault();
                dispatch(sActions.changeStep(6));
              }}
            >
              Request higher limit
            </a>
          </div>
          <div>
            <p>Instructions: </p>
            <div>
              <li>Buy SOV with (r)BTC in your engaged wallet</li>
              <li>Please allow up to 5 mins for the transaction to process</li>
            </div>

            <p>
              For support please join us on{' '}
              <a href="https://discord.com/invite/J22WS6z" target="_new">
                discord.com/invite/J22WS6z
              </a>
            </p>
          </div>
        </div>
        <div className="col-md-6 d-flex justify-content-end">
          <Wrapper className="d-flex flex-column">
            <p className="mb-0">Send (r)BTC:</p>
            <input
              className="rbtc-input"
              type="text"
              placeholder="0.00000000"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <p className="text-right font-sale-sm">
              Available Balance: {trimZero(fromWei(balance))} (r)BTC
            </p>
            <p className="gas-fee">Estimated Gas Fee*: ≈ 0.00 (r)BTC</p>
            <p className="text-center">
              <Icon icon="arrow-down" iconSize={35} />
            </p>
            <p className="mb-0">Receive SOV:</p>
            <p className="sov-res">120,000.00 ≈ $1000.00</p>

            <StyledButton onClick={handleBuy}>BUY SOV</StyledButton>
          </Wrapper>
        </div>
      </div>
    </div>
  ) : (
    <TransactionDetail />
  );
}
