import React, { Dispatch, useEffect, useState } from 'react';
import styled, { css } from 'styled-components/macro';
import SalesButton from '../../components/SalesButton';
import { media } from '../../../styles/media';
import { Icon } from '@blueprintjs/core';
import { fromWei, toWei, weiToFixed } from 'utils/blockchain/math-helpers';
import { useDispatch } from 'react-redux';
import { actions as sActions } from '../SalesPage/slice';
import { useAccount } from 'app/hooks/useAccount';
import { useBalance } from 'app/hooks/useBalance';
import { useSaleCalculator } from '../SalesPage/hooks/useSaleCalculator';
import { handleNumber, prettyTx } from '../../../utils/helpers';
import { LoadableValue } from '../../components/LoadableValue';
import {
  numberToUSD,
  toNumberFormat,
  weiToNumberFormat,
} from '../../../utils/display-text/format';
import {
  SendTxResponse,
  useSendContractTx,
} from '../../hooks/useSendContractTx';
import {
  TxStatus,
  TxType,
} from '../../../store/global/transactions-store/types';
import { bignumber, min } from 'mathjs';
import { SendTxProgress } from '../../components/SendTxProgress';
import { LinkToExplorer } from '../../components/LinkToExplorer';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { gas } from '../../../utils/blockchain/gas-price';
import { useSaleLimits } from '../SalesPage/hooks/useSaleLimits';
import { useSaleIsOpen } from '../SalesPage/hooks/useSaleIsOpen';

interface StyledProps {
  background?: string;
}

const Wrapper = styled.div`
  width: 100%;
  margin-right: 10px;
  margin-top: 4rem;
  ${(props: StyledProps) =>
    props.background &&
    css`
      background: ${props.background};
    `}
  border-radius: 10px;
  ${media.md`
    max-width: 320px;
    margin-top: 0;
  `}
  .rbtc-text {
    font-size: 18px;
  }
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
    padding: 0.9em 0 0.7rem;
    justify-content: center;
    text-align: center;
    font-size: 14px;
    margin-top: 6px;
    font-family: 'Work Sans';
    letter-spacing: 0;
    font-weight: 300;
    span {
      padding-left: 10px;
    }
  }
  .rbtc-input {
    background: white;
    text-align: center;
    border-radius: 8px;
    padding: 10px;
    color: black;
    height: 50px;
    font-size: 22px;
    font-family: 'Work Sans';
    font-weight: 300;
    margin-bottom: 4px;
  }
  .sov-res {
    text-align: center;
    background: #707070;
    border-radius: 8px;
    padding: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 600;
    margin: 10px 0 20px 0;
    span {
      font-size: 14px;
      font-weight: 100;
      padding-left: 6px;
    }
  }
  .font-sale-sm {
    font-size: 14px;
    font-weight: 100;
    a {
      color: white !important;
      font-weight: 100 !important;
    }
  }
  .content {
    padding: 20px;
    font-size: 14px;
    color: #d9d9d9;
    .time {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .amount {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 3px;
    }
    .amount-usd {
      font-size: 16px;
      margin-bottom: 24px;
    }
    .fee {
      font-size: 16px;
      margin-bottom: 50px;
    }
    .address,
    .hash {
      strong {
        width: 40px;
        margin-right: 10px;
      }
    }
    .hash {
      margin-bottom: 54px;
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
  font-size: 24px;
  letter-spacing: 0;
  font-family: 'Work Sans';
  transition: background 0.3s;
  ${media.xl`
    height: 60px;
    padding: 2px 20px;
    border-radius: 8px;
    font-weight: 600;

    &:hover, &:focus {
      background: rgba(78, 205, 196, 0.9) !important;
    }
    &:active:hover {
      background: #4ECDC4 !important;
    }
  `}
  ${props =>
    props.disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}
`;

interface DetailsProps {
  tx: SendTxResponse;
  estimatedFee: string;
  btcAmount: string;
  usdAmount: number;
  dispatch: Dispatch<any>;
}

function TransactionDetail(props: DetailsProps) {
  return (
    <div>
      <p className="content-header">Transaction Details</p>
      <div className="row justify-content-around">
        <div className="col-lg-5 col-md-6">
          <div className="mb-4">
            Your purchase of SOV is made up of 2 transactions. First it is sent
            to the address, where it is instantly converted to RBTC for you. The
            RBTC then automatically purchases the SOV and credits it to your
            wallet. You can easily view the details of each transaction and
            verify them with a block explorer.
          </div>
          <div className="mb-4">
            You will be notified when your transaction has processed.
          </div>
          <div className="mb-5">
            While you wait for your transaction to process, we suggest that you
            add SOV token to your wallet. Click to follow our simple tutorial.
          </div>
          <SalesButton
            text={'Connect SOV to your wallet'}
            onClick={() => props.dispatch(sActions.showTokenTutorial(true))}
          />
        </div>
        <div className="col-lg-4 col-md-5 d-flex justify-content-end">
          <Wrapper background="#383838">
            <div className="header">(r)BTC &gt; SOV</div>
            <div className="content">
              <p className="text-center font-italic time font-weight-light">
                {props.tx.status === 'pending' && (
                  <>Processing approx. 2 minutes</>
                )}
                {props.tx.status === 'confirmed' && (
                  <>SOV is in your wallet now!</>
                )}
                {props.tx.status === 'failed' && <>Transaction failed!</>}
              </p>
              <div className="mx-auto w-75">
                <p className="amount">
                  <strong>
                    {weiToNumberFormat(toWei(props.btcAmount), 5)} (r)BTC
                  </strong>
                </p>
                <p className="amount-usd font-weight-light">
                  ≈ {numberToUSD(props.usdAmount, 2)}
                </p>
                <p className="fee">
                  <strong>Fee:</strong>{' '}
                  {weiToNumberFormat(props.estimatedFee, 8)} (r)BTC
                </p>
              </div>
              <p className="hash mx-auto w-75">
                <strong>Hash:</strong>
                {prettyTx(props.tx.txHash)}
              </p>
              <LinkToExplorer
                txHash={props.tx.txHash}
                text="View in Tracker"
                className="d-block text-center"
              />
            </div>
          </Wrapper>
        </div>
      </div>
    </div>
  );
}

const gasLimit = 260000;
const gasEstimation = bignumber(gasLimit).mul(gas.get()).toFixed();

export default function SendRBTC() {
  const [showTx, setShowTx] = useState(false);
  const dispatch = useDispatch();
  const { minDeposit, maxDeposit } = useSaleLimits();
  const isSaleOpen = useSaleIsOpen();
  const account = useAccount();
  const { value: balance } = useBalance();

  const [amount, setAmount] = useState(weiToFixed(minDeposit, 8));
  const { sovToReceive, price, loading } = useSaleCalculator(amount);

  const weiAmount = useWeiAmount(amount);

  const { send, ...tx } = useSendContractTx('CrowdSale', 'buy');

  const handleBuy = () => {
    send(
      [],
      {
        value: toWei(amount),
        from: account,
        gas: gasLimit,
        gasPrice: 0.06 * 10e8,
      },
      { type: TxType.SALE_BUY_SOV },
    );
  };

  const addAllBalance = e => {
    e && e.preventDefault && e.preventDefault();
    let _balance = bignumber(balance).sub(gasEstimation);
    if (_balance.lessThanOrEqualTo(0)) {
      _balance = bignumber(0);
    }
    setAmount(fromWei(min(bignumber(maxDeposit), _balance)));
  };

  useEffect(() => {
    setShowTx(
      [TxStatus.PENDING, TxStatus.CONFIRMED, TxStatus.FAILED].includes(
        tx.status,
      ) && tx.txHash !== '',
    );
  }, [tx]);

  const checks = {
    limits:
      bignumber(minDeposit).lessThanOrEqualTo(weiAmount) &&
      bignumber(maxDeposit).greaterThanOrEqualTo(weiAmount),
    balance: bignumber(balance)
      .sub(gasEstimation)
      .greaterThanOrEqualTo(weiAmount),
  };
  const canSubmit = Object.values(checks).every(check => check);

  return !showTx ? (
    <div>
      <p className="content-header">Buy SOV with (r)BTC</p>
      <div className="row justify-content-around">
        <div className="col-md-5">
          <div className="mb-4">
            <p className="mb-2">Deposit limits:</p>
            <ul>
              <li>MIN: {weiToNumberFormat(minDeposit, 8)} BTC</li>
              <li>MAX: {weiToNumberFormat(maxDeposit, 8)} BTC</li>
            </ul>
            <a
              href="/genesis#"
              className="d-block"
              onClick={e => {
                e.preventDefault();
                dispatch(sActions.changeStep(3));
              }}
            >
              Input upgrade code
            </a>
            <a
              href="/genesis#"
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
              <ul>
                <li className="mb-2">
                  <span>Buy SOV with (r)BTC in your engaged wallet</span>
                </li>
                <li className="mb-4">
                  <span>
                    Please allow up to 5 mins for the transaction to process
                  </span>
                </li>
              </ul>
            </div>

            <p className="support-text mt-1">
              For support please join us on{' '}
              <a href="https://discord.com/invite/J22WS6z" target="_new">
                discord.com/invite/J22WS6z
              </a>
            </p>
          </div>
        </div>
        <div className="col-md-4 d-flex justify-content-end">
          <Wrapper className="d-flex flex-column">
            <p className="mb-2 rbtc-text">Send (r)BTC:</p>
            <input
              className="rbtc-input"
              type="text"
              placeholder="0.00000000"
              value={amount}
              onChange={e => setAmount(handleNumber(e.target.value))}
            />
            <p className="text-center font-sale-sm mt-2">
              Available Balance:{' '}
              <a href="/genesis#" onClick={addAllBalance}>
                {weiToNumberFormat(balance, 8)}
              </a>{' '}
              (r)BTC
            </p>
            <p className="gas-fee">
              Estimated Gas Fee*:{' '}
              <span>≈ {weiToNumberFormat(gasEstimation, 8)} (r)BTC</span>
            </p>
            <p className="text-center mt-1 mb-2">
              <Icon icon="arrow-down" iconSize={35} />
            </p>
            <p className="mb-0 rbtc-text">Receive SOV:</p>
            <LoadableValue
              loading={loading}
              value={
                <p className="sov-res mb-4">
                  {toNumberFormat(sovToReceive)}{' '}
                  <span>≈ {numberToUSD(price, 2)}</span>
                </p>
              }
            />
            <SendTxProgress
              type={TxType.SALE_BUY_SOV}
              {...tx}
              displayAbsolute={false}
            />
            <StyledButton
              className="mt-1"
              onClick={handleBuy}
              disabled={!canSubmit || !isSaleOpen.open}
            >
              BUY SOV
            </StyledButton>
          </Wrapper>
        </div>
      </div>
    </div>
  ) : (
    <TransactionDetail
      tx={tx}
      estimatedFee={gasEstimation}
      btcAmount={amount}
      usdAmount={price}
      dispatch={dispatch}
    />
  );
}
