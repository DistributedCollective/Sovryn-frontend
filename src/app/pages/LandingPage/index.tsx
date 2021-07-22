import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Header } from 'app/components/Header';
import { translations } from 'locales/i18n';
import { TradingVolume } from './components/TradingVolume';
import { ArbitrageOpportunity } from './components/ArbitrageOpportunity';
import { TotalValueLocked } from './components/TotalValueLocked';
import { Promotions } from './components/Promotions';
import { LendingAssets } from './components/LendingAssets';

export function LandingPage() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t(translations.landingPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.landingPage.meta.description)}
        />
      </Helmet>
      <Header />
      <div className="container tw-max-w-screen-2xl tw-mx-auto tw-mt-20">
        <div className="tw-grid tw-grid-cols-2">
          <div>
            <div className="tw-tracking-normal tw-uppercase tw-mb-20">
              <div className="tw-text-4xl tw-font-semibold tw-mb-5">
                {t(translations.landingPage.welcomeTitle)}
              </div>
              <div className="tw-text-base tw-font-light">
                {t(translations.landingPage.welcomeMessage)}
              </div>
            </div>

            <TradingVolume />
          </div>

          <div>
            <ArbitrageOpportunity />
          </div>
        </div>

        <Promotions />

        <div className="tw-grid tw-grid-cols-2">
          <div>
            <LendingAssets />
          </div>

          <div>Top AMM POOLS</div>
        </div>
        <div className="tw-grid tw-grid-cols-2 tw-my-20">
          <div>Top Spot pairs</div>

          <div>Top Margin pairs</div>
        </div>

        <TotalValueLocked />
      </div>
    </>
  );
}
