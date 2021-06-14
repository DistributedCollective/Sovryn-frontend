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
// import { RewardHistory } from './components/RewardHistory';
import { ClaimForm } from './components/ClaimForm';
import { useAccount } from 'app/hooks/useAccount';

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
      <div className="reward">
        <div className="tw-container tw-mt-12 tw-mx-auto tw-px-6">
          <h2 className="mb-3 tw-text-xl tw-font-semibold tw-text-center">
            {t(translations.rewardPage.totalClaimed) + ' '} 0 SOV
          </h2>
        </div>

        <div className="tw-container tw-mt-9 tw-mx-auto xl:tw-px-16  xl:tw-w-3/5">
          <div className="lg:tw-grid tw-grid-cols-3 tw-gap-2 tw-mx-2">
            <div className="xl:tw-mx-1 tw-bg-gray-800 tw-staking-box tw-p-4 tw-rounded-lg tw-text-sm tw-mb-4 lg:tw-mb-0">
              <div className="tw-text-xl tw-font-semibold tw-mb-9">
                {t(translations.rewardPage.topData.referralRewards)}
              </div>
              <div className="tw-flex tw-items-start">
                <div className="tw-p-2 tw-bg-orange tw-mr-5"></div>
                <div>
                  <div className="mb-3">
                    <p className="tw-text-xs mb-1">
                      {t(translations.rewardPage.topData.availableRewards)}
                    </p>
                    <p className="tw-text-xl tw-font-semibold">15.2976 SOV</p>
                  </div>
                  <div className="mb-3">
                    <p className="tw-text-xs mb-1">
                      {t(translations.rewardPage.totalClaimed)}
                    </p>
                    <p className="tw-text-xl tw-font-semibold">73.5927 SOV</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="xl:tw-mx-1 tw-bg-gray-800 tw-staking-box tw-p-4 tw-rounded-lg tw-text-sm tw-mb-4 lg:tw-mb-0">
              <div className="tw-text-xl tw-font-semibold tw-mb-9">
                {t(translations.rewardPage.topData.liquidityRewards)}
              </div>
              <div className="tw-flex tw-items-start">
                <div className="tw-p-2 tw-bg-white tw-mr-5"></div>
                <div>
                  <div className="mb-3">
                    <p className="tw-text-xs mb-1">
                      {t(translations.rewardPage.topData.liquidityRewards)}
                    </p>
                    <p className="tw-text-xl tw-font-semibold">15.2976 SOV</p>
                  </div>
                  <div className="mb-3">
                    <p className="tw-text-xs mb-1">
                      {t(translations.rewardPage.totalClaimed)}
                    </p>
                    <p className="tw-text-xl tw-font-semibold">73.5927 SOV</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="xl:tw-mx-1 tw-bg-gray-800 tw-staking-box tw-p-4 tw-rounded-lg tw-text-sm tw-mb-4 lg:tw-mb-0">
              <div className="tw-text-xl tw-font-semibold tw-mb-9">
                {t(translations.rewardPage.topData.OGRewards)}
              </div>
              <div className="tw-flex tw-items-start">
                <div className="tw-p-2 tw-bg-green tw-mr-5"></div>
                <div>
                  <div className="mb-3">
                    <p className="tw-text-xs mb-1">
                      {t(translations.rewardPage.topData.availableRewards)}
                    </p>
                    <p className="tw-text-xl tw-font-semibold">15.2976 SOV</p>
                  </div>
                  <div className="mb-3">
                    <p className="tw-text-xs mb-1">
                      {t(translations.rewardPage.totalClaimed)}
                    </p>
                    <p className="tw-text-xl tw-font-semibold">73.5927 SOV</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="tw-bg-black tw-rounded-3xl tw-mt-12 lg:tw-flex tw-justify-between tw-items-center tw-mx-4">
            <div className="tw-p-12 lg:tw-w-1/3 lg:tw-mr-5">
              <div className="tw-text-xs mb-2 tw-flex tw-items-center">
                <div className="tw-p-2 tw-bg-orange tw-mr-5"></div>
                50.00% - Referral Rewards
              </div>
              <div className="tw-text-xs mb-2 tw-flex tw-items-center">
                <div className="tw-p-2 tw-bg-white tw-mr-5"></div>
                16.66% - Liquidity Rewards
              </div>
              <div className="tw-text-xs mb-2 tw-flex tw-items-center">
                <div className="tw-p-2 tw-bg-green tw-mr-5"></div>
                33.33% - OG Rewards
              </div>
            </div>
            <div>
              <ClaimForm address={userAddress} />
            </div>
          </div>
        </div>
      </div>

      {/* <div className="tw-container tw-mt-9 tw-mx-auto tw-px-6">
        <h2 className="mb-4 tw-text-2xl tw-font-semibold">
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

        <div className="tw-mt-4 tw-flex tw-gap-8 tw-justify-center">
          <div className="tw-flex-1">
           <RewardHistory account={userAddress} />
          </div>
          <ClaimForm address={userAddress} />
        </div>
      </div> */}
      <Footer />
    </>
  );
}
