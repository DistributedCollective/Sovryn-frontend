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
  max-width: 1200px;
  margin: 40px auto;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  .tab-content {
    background: black;
    position: relative;
    padding-left: 120px;
    padding-right: 120px;
    padding-bottom: 25px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    .content-header {
      font-size: 28px;
      text-align: center;
      margin-top: 1em;
    }
    a {
      color: var(--gold) !important;
      font-weight: normal;
      font-size: 14px;
    }
  }
`;

export default function Screen4() {
  const [activeTrades, setActiveTrades] = useState(false);
  const [showCalc, setShowCalc] = useState(false);

  return (
    <StyledContent>
      <div className="d-flex flex-row">
        <div>
          <Tab
            text={'BTC'}
            active={activeTrades}
            onClick={() => setActiveTrades(true)}
          >
            <img src={BTCLogo} alt="BTC" /> BTC
          </Tab>
        </div>
        <div>
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
