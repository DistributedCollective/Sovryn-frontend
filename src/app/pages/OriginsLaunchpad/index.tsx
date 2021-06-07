import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Header } from 'app/components/Header';
import { Footer } from 'app/components/Footer';
import { UpcomingSalesCardSection } from './components/UpcomingSalesCardSection';
import { PreviousSalesCardSection } from './components/PreviousSalesCardSection';
import { EmailSubscribeSection } from './components/EmailSubscribeSection';

export const OriginsLaunchpad: React.FC = () => {
  const { t } = useTranslation();

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

      <div className="container tw-pt-11 font-family-montserrat">
        <div className="tw-text-center tw-text-3xl tw-font-semibold">
          {t(translations.originsLaunchpad.upcomingSales.title)}
        </div>
        <div className="tw-mt-16">
          <UpcomingSalesCardSection />
          <EmailSubscribeSection />
        </div>

        <div className="tw-mt-36 tw-mb-60">
          <div className="tw-text-center tw-text-3xl tw-font-semibold">
            {t(translations.originsLaunchpad.previousSales.title)}
          </div>
          <PreviousSalesCardSection />
        </div>

        <Footer />
      </div>
    </>
  );
};
