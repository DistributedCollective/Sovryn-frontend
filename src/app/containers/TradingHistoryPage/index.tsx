import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useIsConnected } from '../../hooks/useAccount';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { TradingHistory } from '../TradingHistory';

export function TradingHistoryPage() {
  const isConnected = useIsConnected();
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <main className="container">
        <h2 className="mb-4">{t(translations.tradingHistoryPage.title)}</h2>
        {!isConnected && <div>{t(translations.tradingHistoryPage.auth)}</div>}
        {isConnected && <TradingHistory />}
      </main>
      <Footer />
    </>
  );
}
