/**
 *
 * RewardPage
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Helmet } from 'react-helmet-async';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { RewardBox } from './components/RewardBox';
import { ClaimForm } from './components/ClaimForm';

export function RewardPage() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t(translations.rewardPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.rewardPage.meta.description)}
        />
      </Helmet>
      <Header />

      <div className="tw-container tw-mt-9 tw-mx-auto tw-px-6">
        <h2 className="mb-4 tw-text-2xl tw-font-semibold">
          {t(translations.rewardPage.totalEarned) + ' '} 138.8372 SOV
        </h2>
        <div className="tw-grid tw-grid-cols-3 tw-gap-8">
          <RewardBox
            title="Referral Rewards"
            items={[
              { key: 'Number of referrals:', value: 5 },
              { key: 'Available Rewards:', value: '15.4323 SOV' },
              { key: 'Total Rewards Earned:', value: '73.5927 SOV' },
            ]}
          />
          <RewardBox
            title="Liquidity Rewards"
            items={[
              { key: 'Number of referrals:', value: 5 },
              { key: 'Available Rewards:', value: '15.4323 SOV' },
              { key: 'Total Rewards Earned:', value: '73.5927 SOV' },
            ]}
          />
          <RewardBox
            title="OG Rewards"
            items={[
              { key: 'Number of referrals:', value: 5 },
              { key: 'Available Rewards:', value: '15.4323 SOV' },
              { key: 'Total Rewards Earned:', value: '73.5927 SOV' },
            ]}
          />
        </div>
        <div className="tw-mt-4">
          <ClaimForm />
        </div>
      </div>
      <Footer />
    </>
  );
}
