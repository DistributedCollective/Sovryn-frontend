import React, { useState } from 'react';
import { ActiveUserLoans } from '../ActiveUserLoans';
import { TradingHistory } from '../TradingHistory';
import { Tab } from '../../components/Tab';
import { useIsConnected } from '../../hooks/useAccount';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';

export function TradingActivity() {
  const isConnected = useIsConnected();
  const [activeTrades, setActiveTrades] = useState(true);
  return (
    <div>
      <div className="row mt-5 mb-1">
        <h3 className="col-8 my-0 text-Grey_text">TRADING ACTIVITY</h3>
        <div className="col-4 row">
          <div
            className={`bg-${
              activeTrades ? 'component-bg' : 'primaryBackground'
            } col-6 p-0`}
            onClick={() => setActiveTrades(true)}
          >
            <Tab text="Active Trades" active={activeTrades} />
          </div>
          <div
            className={`bg-${
              !activeTrades ? 'component-bg' : 'primaryBackground'
            } col-6 p-0`}
            onClick={() => setActiveTrades(false)}
          >
            <Tab text="Trading History" active={!activeTrades} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          {!isConnected ? (
            <SkeletonRow loadingText="Connect to your Wallet first." />
          ) : activeTrades ? (
            <ActiveUserLoans />
          ) : (
            <TradingHistory />
          )}
        </div>
      </div>
    </div>
  );
}
