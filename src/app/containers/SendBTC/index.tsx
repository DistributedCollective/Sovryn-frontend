import React, { useState, useCallback } from 'react';
import QRCode from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Icon } from '@blueprintjs/core';
import { Tab } from '../../components/SalesTab';
import SalesButton from '../../components/SalesButton';
import styled, { css } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { SHOW_MODAL } from 'utils/classifiers';
import { reactLocalStorage } from 'reactjs-localstorage';
import { actions } from '../TutorialSOVModal/slice';

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
function TransactionDetail() {
  const [activeTx, setActiveTx] = useState(true);

  const dispatch = useDispatch();
  const handleSOVTutorial = useCallback(() => {
    dispatch(actions.showModal(SHOW_MODAL));
    reactLocalStorage.set('closedRskTutorial', 'false');
  }, [dispatch]);

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
          <SalesButton text={'Connect SOV to your wallet'} 
          onClick={handleSOVTutorial} />
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

const BTCAddClipboard = styled.span`
  padding: 15px;
  font-size: 14px;
  margin-top: 30px;
  margin-bottom: 30px;
  display: block;
  border-radius: 5px;
  position: relative;
  background: #2d2d2d;
  .bp3-icon {
    background: #575757;
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
  }
`;

export default function SendBTC({ setShowCalc }) {
  const [showTx, setShowTx] = useState(false);

  return !showTx ? (
    <div>
      <div>
        <p className="content-header">Send BTC to receive SOV</p>
        <div className="row no-gutters">
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
                <li>Send BTC to receive SOV in your engaged wallet</li>
                <li>
                  Do not send anything other than BTC to this address otherwise
                  your assets will be lost permanently
                </li>
                <li>
                  Please allow up to xx mins for the transaction to process
                </li>
              </div>

              <p>
                For support please join us on <a>discord.com/invite/J22WS6z</a>
              </p>
            </div>
            <SalesButton
              text={'Calculate how much SOV you receive'}
              onClick={() => setShowCalc(true)}
            />
          </div>
          <div className="col-md-6 d-flex justify-content-end">
            <Wrapper>
              <p>Send BTC to this address:</p>
              <div className="row justify-content-center qr-wrapper">
                <QRCode
                  value={'0x3242348923892374823ae22879'}
                  renderAs="svg"
                  bgColor="var(--white)"
                  fgColor="var(--primary)"
                  includeMargin={true}
                  className="rounded btc-address"
                />
              </div>
              <CopyToClipboard
                text="https://public-node.rsk.co"
                onCopy={() => alert('Copied!')}
              >
                <BTCAddClipboard className="cursor-pointer">
                  1A1zP1eP5QGefi2.......mv7DivfNa <Icon icon="duplicate" />
                </BTCAddClipboard>
              </CopyToClipboard>
              <div className="show-tx" onClick={() => setShowTx(true)}>
                Waiting for transaction{' '}
                <Icon className="d-flex align-items-center" icon="refresh" />
              </div>
            </Wrapper>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <TransactionDetail />
  );
}
