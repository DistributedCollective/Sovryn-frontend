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
import { ClaimForm } from './components/ClaimForm';
import { useAccount } from 'app/hooks/useAccount';
import { HistoryTable } from './components/HistoryTable';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { StakingRewardsClaimForm } from './components/StakingRewardsClaimForm';

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
        <div className="tw-mt-4 tw-items-center tw-flex tw-flex-col">
          <ClaimForm address={userAddress} />
          <StakingRewardsClaimForm address={userAddress} className="tw-mt-8" />
          <div className="tw-flex-1 tw-mt-12 tw-w-full">
            <div className="tw-px-3 tw-text-lg">
              {t(translations.rewardPage.historyTable.title)}
            </div>
            {!userAddress ? (
              <SkeletonRow
                loadingText={t(
                  translations.rewardPage.historyTable.walletHistory,
                )}
                className="tw-mt-2"
              />
            ) : (
              <HistoryTable />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
