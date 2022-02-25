import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Header } from 'app/components/Header';
import { Footer } from 'app/components/Footer';
//import { SalesDay } from './pages/SalesDay';
import { Dashboard } from './pages/Dashboard';

export const OriginsLaunchpad: React.FC = () => {
  const { t } = useTranslation();

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
        {/* <SalesDay saleName="MYNT" /> */}
        <Dashboard />
      </div>
      <Footer />
    </>
  );
};
