import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ActiveUserLoans } from '../ActiveUserLoans';
import { TradingHistory } from '../TradingHistory';
import { Tab } from '../../components/Tab';
import { useIsConnected } from '../../hooks/useAccount';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { NotificationForm } from '../../components/NotificationForm/NotificationFormContainer';

const s = translations.tradingActivity;

export function TradingActivity() {
  const { t } = useTranslation();
  const isConnected = useIsConnected();
  const [activeTrades, setActiveTrades] = useState(true);
  return (
    <div>
      <div className="tw-mt-10 tw-mb-8 tw-flex tw-flex-col md:tw-flex-row md:tw-justify-between md:tw-items-center">
        <h3 className="tw-mt-0 tw-mb-6 md:tw-mb-0 tw-text-white">
          {t(s.title)}
          <NotificationForm />
        </h3>

        <div className="tw-flex tw-flex-row tw-items-center tw-justify-start md:tw-justify-end">
          <div className="tw-mr-4">
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
      <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-1">
        {!isConnected ? (
          <SkeletonRow loadingText={t(s.walletNote)} />
        ) : activeTrades ? (
          <ActiveUserLoans loanType={1} />
        ) : (
          <TradingHistory />
        )}
      </div>
    </div>
  );
}
