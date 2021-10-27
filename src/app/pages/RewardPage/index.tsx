import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { translations } from 'locales/i18n';

import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { HistoryTable } from './components/HistoryTable';
import { LiquidTab } from './components/LiquidTab';
import { RewardTab } from './components/RewardTab';
import { Tab } from './components/Tab';
import { RewardTabType } from './types';

import imgSov from 'assets/images/reward/sov.svg';
import imgBtc from 'assets/images/reward/Bitcoin.svg';
import styles from './index.module.scss';
import { FeesEarnedTab } from './components/FeesEarnedTab';
import { Asset } from 'types';
import { useGetLiquidSovClaimAmount } from './hooks/useGetLiquidSovClaimAmount';
import { useGetRewardSovClaimAmount } from './hooks/useGetRewardSovClaimAmount';
import { useGetFeesEarnedClaimAmount } from './hooks/useGetFeesEarnedClaimAmount';
import { useAccount } from 'app/hooks/useAccount';

export function RewardPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(RewardTabType.REWARD_SOV);
  const address = useAccount();

  const {
    availableLendingRewards,
    availableTradingRewards,
    availableLiquidityRewards,
    availableLockedSovBalance,
    amountToClaim: rewardSovClaimAmount,
  } = useGetRewardSovClaimAmount();

  const liquidSovClaimAmount = useGetLiquidSovClaimAmount();
  const feesEarnedClaimAmount = useGetFeesEarnedClaimAmount();

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

      <div className={styles['background-image-wrapper']}>
        <img className={styles['background-image']} src={imgSov} alt="SOV" />
        <img className={styles['background-image']} src={imgBtc} alt="BTC" />
      </div>

      <div className="tw-container tw-mt-9 tw-mx-auto tw-px-6 tw-relative">
        <div className="tw-mt-4 tw-items-center tw-flex tw-flex-col">
          <div className={styles['page-main-section']}>
            <div className="tw-flex tw-flex-row tw-items-center tw-justify-start tw-mt-24">
              <div className="tw-w-full">
                <Tab
                  text={t(translations.rewardPage.sov.reward)}
                  amountToClaim={rewardSovClaimAmount}
                  active={activeTab === RewardTabType.REWARD_SOV}
                  onClick={() => setActiveTab(RewardTabType.REWARD_SOV)}
                />
              </div>
              <div className="tw-w-full">
                <Tab
                  text={t(translations.rewardPage.sov.liquid)}
                  active={activeTab === RewardTabType.LIQUID_SOV}
                  onClick={() => setActiveTab(RewardTabType.LIQUID_SOV)}
                  amountToClaim={liquidSovClaimAmount}
                />
              </div>
              <div className="tw-w-full">
                <Tab
                  text={t(translations.rewardPage.sov.fee)}
                  active={activeTab === RewardTabType.FEES_EARNED}
                  onClick={() => setActiveTab(RewardTabType.FEES_EARNED)}
                  amountToClaim={feesEarnedClaimAmount}
                  asset={Asset.RBTC}
                />
              </div>
            </div>
            <div className="tw-flex-1 tw-flex tw-justify-center tw-align-center">
              {activeTab === RewardTabType.REWARD_SOV && (
                <RewardTab
                  availableLendingRewards={availableLendingRewards}
                  availableLiquidityRewards={availableLiquidityRewards}
                  availableTradingRewards={availableTradingRewards}
                  availableLockedSovBalance={availableLockedSovBalance}
                  amountToClaim={rewardSovClaimAmount}
                />
              )}
              {activeTab === RewardTabType.LIQUID_SOV && (
                <LiquidTab amountToClaim={liquidSovClaimAmount} />
              )}
              {activeTab === RewardTabType.FEES_EARNED && (
                <FeesEarnedTab amountToClaim={feesEarnedClaimAmount} />
              )}
            </div>
          </div>
          <div className="tw-flex-1 tw-mt-12 tw-w-full">
            <div className="tw-px-3 tw-text-lg">
              {activeTab === RewardTabType.FEES_EARNED
                ? t(translations.rewardPage.historyTable.titleFeesEarned)
                : t(translations.rewardPage.historyTable.title)}
            </div>
            {!address ? (
              <SkeletonRow
                loadingText={t(
                  translations.rewardPage.historyTable.walletHistory,
                )}
                className="tw-mt-2"
              />
            ) : (
              <HistoryTable activeTab={activeTab} />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
