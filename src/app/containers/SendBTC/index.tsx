import React, { useCallback, Dispatch, useState } from 'react';
import QRCode from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Icon } from '@blueprintjs/core';
import SalesButton from '../../components/SalesButton';
import styled, { css } from 'styled-components/macro';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { prettyTx } from 'utils/helpers';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { actions as sActions } from '../SalesPage/slice';
import { selectSalesPage } from '../SalesPage/selectors';
import { toaster } from '../../../utils/toaster';
import { BtcDeposit } from '../SalesPage/types';
import { Tab } from '../../components/SalesTab';
import { Nullable } from '../../../types';
import { useSaleCalculator } from '../SalesPage/hooks/useSaleCalculator';
import {
  numberToUSD,
  weiToNumberFormat,
} from '../../../utils/display-text/format';
import { useSaleLimits } from '../SalesPage/hooks/useSaleLimits';

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
  @media (max-width: 640px) {
    width: 100%;
  }
  .btc-text {
    font-size: 18px;
  }
  .header {
    display: flex;
    justify-content: center;
    padding: 10px 0;
    border-bottom: 1px solid #383838;
  }
  .qr-wrapper {
    background: white;
    border-radius: 10px;
    margin: 0;
    svg {
      width: 200px;
      height: 200px;
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
    span {
      animation: rotateY 1.5s linear infinite;
      animation-direction: reverse;
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

interface TxProps {
  address: any;
  deposit: Nullable<BtcDeposit>;
  transfer: Nullable<BtcDeposit>;
  dispatch: Dispatch<any>;
}

function TransactionDetail({ deposit, transfer, address, dispatch }: TxProps) {
  const [activeTx, setActiveTx] = useState(true);
  const handleSOVTutorial = useCallback(() => {
    dispatch(sActions.showTokenTutorial(true));
  }, [dispatch]);
  const handleBack = e => {
    e && e.preventDefault && e.preventDefault();
    dispatch(sActions.changeStep(4));
  };
  const { price: depositPrice } = useSaleCalculator(deposit?.value || '0.01');
  const { price: transferPrice } = useSaleCalculator(transfer?.value || '0.01');
  return (
    <div>
      <p className="content-header">Transaction Details</p>
      <div className="row no-gutters">
        <div className="col-md-6">
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
            onClick={handleSOVTutorial}
          />
          <a href="/sales#" onClick={handleBack}>
            Make another transaction?
          </a>
        </div>
        <div className="col-md-6 d-flex flex-column align-items-end">
          <div className="d-flex">
            <Tab
              text={'BTC > (r)BTC'}
              active={activeTx}
              background="#242424"
              opacity={0.75}
              width={160}
              onClick={() => setActiveTx(true)}
            >
              {'BTC > (r)BTC'}
            </Tab>
            <Tab
              text={'(r)BTC > SOV'}
              active={!activeTx}
              background="#242424"
              opacity={0.75}
              width={160}
              onClick={() => setActiveTx(false)}
            >
              {'(r)BTC > SOV'}
            </Tab>
          </div>
          <Wrapper background="#242424">
            {activeTx ? (
              <>
                {deposit ? (
                  <div className="content">
                    <p className="text-center font-italic time font-weight-light">
                      {deposit.status === 'pending' && (
                        <>Processing approx. 15 minutes</>
                      )}
                      {deposit.status === 'confirmed' && (
                        <>Confirmed! Converting rBTC to SOV.</>
                      )}
                      {deposit.status === 'failed' && <>Transaction failed!</>}
                    </p>
                    <p className="amount">{deposit.value} BTC</p>
                    <p className="amount-usd font-weight-light">
                      ≈ {numberToUSD(depositPrice, 2)}
                    </p>
                    <p className="address">
                      <strong>To:</strong>
                      {prettyTx(address, 6, 4)}
                    </p>
                    <p className="hash">
                      <strong>Hash:</strong>
                      {prettyTx(deposit.txHash, 6, 4)}
                    </p>
                    <LinkToExplorer
                      txHash={deposit.txHash}
                      text="View in Tracker"
                      realBtc={true}
                      className="d-block text-center"
                    />
                  </div>
                ) : (
                  <div className="content">No deposit received.</div>
                )}
              </>
            ) : (
              <>
                {transfer ? (
                  <div className="content">
                    <p className="text-center font-italic time font-weight-light">
                      {transfer.status === 'pending' && (
                        <>Processing approx. 2 minutes</>
                      )}
                      {transfer.status === 'confirmed' && (
                        <>SOV is in your wallet now!</>
                      )}
                      {transfer.status === 'failed' && <>Transaction failed!</>}
                    </p>
                    <p className="amount">{transfer.value} (r)BTC</p>
                    <p className="amount-usd font-weight-light">
                      ≈ {numberToUSD(transferPrice, 2)}
                    </p>
                    <p className="address">
                      <strong>To:</strong>
                      {prettyTx(address, 6, 4)}
                    </p>
                    <p className="hash">
                      <strong>Hash:</strong>
                      {transfer.txHash}
                    </p>
                    <LinkToExplorer
                      txHash={transfer.txHash}
                      text="View in Tracker"
                      className="d-block text-center"
                    />
                  </div>
                ) : (
                  <div className="content">No deposit received.</div>
                )}
              </>
            )}
          </Wrapper>
        </div>
      </div>
    </div>
  );
}

const BTCAddClipboard = styled.span`
  padding: 15px;
  font-size: 14px;
  margin-top: 30px;
  margin-bottom: 30px;
  display: block;
  border-radius: 5px;
  position: relative;
  background: #383838;
  .bp3-icon {
    background: #686868;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 280px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0 5px 5px 0;
    @media (max-width: 640px) {
      left: auto;
    }
  }
`;

export default function SendBTC({ setShowCalc }) {
  const { btcAddress, btcDeposit, transferDeposit } = useSelector(
    selectSalesPage,
  );
  const { minDeposit, maxDeposit } = useSaleLimits();
  const dispatch = useDispatch();

  return btcDeposit === null && transferDeposit === null ? (
    <div>
      <div>
        <p className="content-header">Send BTC to receive SOV</p>
        <div className="row justify-content-around">
          <div className="col-md-5 mb-1">
            <div className="mb-4">
              <p className="mb-2">Deposit limits:</p>
              <ul>
                <li>MIN: {weiToNumberFormat(minDeposit, 8)} BTC</li>
                <li>MAX: {weiToNumberFormat(maxDeposit, 8)} BTC</li>
              </ul>
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
            <div className="mb-4">
              <p>Instructions: </p>
              <div>
                <ul>
                  <li className="mb-2">
                    Send BTC to receive SOV in your engaged wallet
                  </li>
                  <li className="mb-2">
                    Do not send anything other than BTC to this address
                    otherwise your assets will be lost permanently
                  </li>
                  <li className="mb-2">
                    Please allow up to 15 mins for the transaction to process
                  </li>
                </ul>
              </div>

              <p>
                For support please join us on{' '}
                <a href="https://discord.gg/dAbhsk4C" target="_new">
                  https://discord.gg/dAbhsk4C
                </a>
              </p>
            </div>
            <SalesButton
              text={'Calculate how much SOV you receive'}
              onClick={() => setShowCalc(true)}
            />
          </div>
          <div className="col-md-4 d-flex justify-content-center">
            <Wrapper>
              <p className="mb-2 btc-text">Send BTC to this address:</p>
              <div className="row justify-content-center qr-wrapper">
                {btcAddress && (
                  <QRCode
                    value={btcAddress}
                    renderAs="svg"
                    bgColor="var(--white)"
                    fgColor="var(--primary)"
                    includeMargin={true}
                    className="rounded btc-address"
                  />
                )}
              </div>
              <CopyToClipboard
                text={btcAddress}
                onCopy={() =>
                  toaster.show({ message: 'Deposit address copied.' })
                }
              >
                <BTCAddClipboard className="cursor-pointer">
                  {btcAddress ? (
                    <>
                      {' '}
                      {prettyTx(btcAddress, 6, 4)}{' '}
                      <Icon icon="duplicate" color="#FEC004" />
                    </>
                  ) : (
                    <>Generating address...</>
                  )}
                </BTCAddClipboard>
              </CopyToClipboard>
              <div className="show-tx" onClick={() => {}}>
                Waiting for transaction{' '}
                <Icon className="d-flex align-items-center" icon="refresh" />
              </div>
            </Wrapper>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <TransactionDetail
      deposit={btcDeposit}
      transfer={transferDeposit}
      dispatch={dispatch}
      address={btcAddress}
    />
  );
}
