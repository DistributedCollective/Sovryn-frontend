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
// import { RewardBox } from './components/RewardBox';
import { ClaimForm } from './components/ClaimForm';
import { useAccount } from 'app/hooks/useAccount';
import { RewardHistory } from './components/RewardHistory';

export function RewardPage() {
  const { t } = useTranslation();
  const userAddress = useAccount();

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
        {/*<h2 className="mb-4 tw-text-2xl tw-font-semibold">
          {t(translations.rewardPage.totalEarned) + ' '} 0 SOV
        </h2>
        <div className="tw-grid tw-grid-cols-3 tw-gap-8">
          <RewardBox
            title={t(translations.rewardPage.topData.referralRewards)}
            items={[
              { key: t(translations.rewardPage.topData.referrals), value: 0 },
              {
                key: t(translations.rewardPage.topData.availableRewards),
                value: '0 SOV',
              },
              {
                key: t(translations.rewardPage.topData.totalRewards),
                value: '0 SOV',
              },
            ]}
          />
          <RewardBox
            title={t(translations.rewardPage.topData.liquidityRewards)}
            items={[
              {
                key: t(translations.rewardPage.topData.lockedRewards),
                value: '0 SOV',
              },
              {
                key: t(translations.rewardPage.topData.claimibleRewards),
                value: '0 SOV',
              },
              {
                key: t(translations.rewardPage.topData.totalRewards),
                value: '0 SOV',
              },
            ]}
          />
          <RewardBox
            title={t(translations.rewardPage.topData.OGRewards)}
            items={[
              {
                key: t(translations.rewardPage.topData.availableRewards),
                value: '0 SOV',
              },

              {
                key: t(translations.rewardPage.topData.totalRewards),
                value: '0 SOV',
              },
            ]}
          />
        </div>
         */}
        <div className="tw-mt-4 tw-flex tw-gap-8">
          <div className="tw-flex-1">
            <RewardHistory account={userAddress} />
          </div>
          <ClaimForm address={userAddress} />
        </div>
      </div>
      <Footer />
    </>
  );
}
