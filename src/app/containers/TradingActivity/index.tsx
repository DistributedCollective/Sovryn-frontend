import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActiveUserLoans } from '../ActiveUserLoans';
import { TradingHistory } from '../TradingHistory';
import { Tab } from '../../components/Tab';
import { useIsConnected } from '../../hooks/useAccount';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { translations } from 'locales/i18n';

const s = translations.tradingActivity;

export function TradingActivity() {
  const { t } = useTranslation();
  const isConnected = useIsConnected();
  const [activeTrades, setActiveTrades] = useState(true);
  return (
    <div>
      <div className="mt-5 mb-4 d-flex flex-column flex-md-row justify-content-md-between align-items-md-center">
        <h3 className="mt-0 mb-3 mb-md-0 text-white">{t(s.title)}</h3>
        <div className="d-flex flex-row align-items-center justify-content-start justify-content-md-end">
          <div className="mr-3">
            <Tab
              text={t(s.tabs.activeTrades)}
              active={activeTrades}
              onClick={() => setActiveTrades(true)}
            />
          </div>
          <div>
            <Tab
              text={t(s.tabs.tradingHistory)}
              active={!activeTrades}
              onClick={() => setActiveTrades(false)}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          {!isConnected ? (
            <SkeletonRow loadingText={t(s.walletNote)} />
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
