import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Header } from 'app/components/Header';
import { Footer } from 'app/components/Footer';
import { Dashboard } from './pages/Dashboard/index';
import { SalesDay } from './pages/SalesDay/index';
import { useGetActiveSaleTierId } from './hooks/useGetActiveSaleTierId';

export const OriginsLaunchpad: React.FC = () => {
  const { t } = useTranslation();
  const activeTierId = useGetActiveSaleTierId();

  useEffect(() => {
    document.body.classList.add('originsLaunchpad');

    return () => document.body.classList.remove('originsLaunchpad');
  });

  return (
    <>
      <Helmet>
        <title>{t(translations.escrowPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.escrowPage.meta.description)}
        />
      </Helmet>
      <Header />

      <div className="tw-container tw-pt-11 tw-font-body">
        {activeTierId > 0 ? (
          <SalesDay tierId={activeTierId} saleName="FISH" />
        ) : (
          <Dashboard />
        )}
        <Footer />
      </div>
    </>
  );
};
