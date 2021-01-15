import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { Tab } from 'app/components/SalesTab';

import BTCLogo from 'assets/images/btc_logo.svg';
import RBTCLogo from 'assets/images/rbtc_logo.svg';

import SendBTC from 'app/containers/SendBTC';
import SendRBTC from 'app/containers/SendRBTC';
import SOVCalculator from 'app/components/SOVCalculator';

const StyledContent = styled.div`
  background: var(--sales-background);
  max-width: 1235px;
  margin: 40px auto;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  .tab-item button {
    font-size: 20px;
  }
  .tab-content {
    background: black;
    min-height: 560px;
    height: 100%;
    position: relative;
    padding-left: 3.5rem;
    padding-right: 3.5rem;
    padding-bottom: 25px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    .content-header {
      font-size: 28px;
      text-align: center;
      margin-top: 1em;
      margin-bottom: 1.4rem;
    }
    .support-text {
      font-size: 14px;
      margin-top: 30px;
    }
    a {
      color: var(--gold);
      font-weight: normal;
      font-size: 14px;
    }
    p {
      margin-bottom: 0.4rem;
    }
    ul {
      padding: 0 18px;
      margin: 0 0 3px 0;
      li {
        font-size: 16px;
        font-weight: 300;
        span {
          font-size: 14px;
        }
      }
    }
  }
`;

export default function Screen4() {
  const [activeTrades, setActiveTrades] = useState(false);
  const [showCalc, setShowCalc] = useState(false);

  return (
    <StyledContent>
      <div className="d-flex flex-row">
        <div className="tab-item">
          <Tab
            text={'BTC'}
            active={activeTrades}
            onClick={() => setActiveTrades(true)}
          >
            <img src={BTCLogo} alt="BTC" /> BTC
          </Tab>
        </div>
        <div className="tab-item">
          <Tab
            text={'RBTC'}
            active={!activeTrades}
            onClick={() => setActiveTrades(false)}
          >
            <img src={RBTCLogo} alt="RBTC" /> (r)BTC
          </Tab>
        </div>
      </div>
      <div className="tab-content">
        <div className="col-12">
          {activeTrades ? <SendBTC setShowCalc={setShowCalc} /> : <SendRBTC />}
        </div>
        {showCalc && <SOVCalculator setShowCalc={setShowCalc} />}
      </div>
    </StyledContent>
  );
}
