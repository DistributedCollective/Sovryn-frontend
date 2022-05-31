import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { translations } from 'locales/i18n';

import { HistoryTable } from './components/HistoryTable';
import { LiquidTab } from './components/LiquidTab';
import { RewardTab } from './components/RewardTab';
import { Tab } from './components/Tab';
import { RewardTabType } from './types';

import styles from './index.module.scss';
import { FeesEarnedTab } from './components/FeesEarnedTab';
import { Asset } from 'types';
import { useGetLiquidSovClaimAmount } from './hooks/useGetLiquidSovClaimAmount';
import { useGetRewardSovClaimAmount } from './hooks/useGetRewardSovClaimAmount';
import { useGetFeesEarnedClaimAmount } from './hooks/useGetFeesEarnedClaimAmount';
import { useAccount } from 'app/hooks/useAccount';
import { Button, ButtonStyle } from 'app/components/Button';

export function RewardPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(RewardTabType.REWARD_SOV);
  const address = useAccount();

  const {
    availableLendingRewards,
    availableTradingRewards,
    availableLiquidityRewards,
    amountToClaim: rewardSovClaimAmount,
  } = useGetRewardSovClaimAmount();

  const {
    amount: liquidSovClaimAmount,
    lastWithdrawalInterval,
  } = useGetLiquidSovClaimAmount();

  const {
    totalAmount: totalFeesEarned,
    earnedFees,
    loading: feesLoading,
  } = useGetFeesEarnedClaimAmount();

  return (
    <>
      <Helmet>
        <title>{t(translations.rewardPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.rewardPage.meta.description)}
        />
      </Helmet>

      <div className="tw-container tw-mx-auto tw-flex tw-mt-10 xl:tw-max-w-2/3 tw-relative">
        <Button
          text={t(translations.portfolioPage.portfolio)}
          style={ButtonStyle.link}
          className="tw-text-2xl tw-text-gray-6 hover:tw-no-underline hover:tw-text-sov-white focus:tw-no-underline"
          href="/wallet"
        />
        <Button
          text={t(translations.portfolioPage.rewards)}
          style={ButtonStyle.link}
          className="tw-ml-10 tw-text-2xl tw-text-sov-white hover:tw-no-underline focus:tw-no-underline"
        />
      </div>

      <div className="tw-container tw-mt-2 tw-mx-auto tw-px-6 tw-relative">
        <div className="tw-mt-4 tw-items-center tw-flex tw-flex-col">
          <div className={styles['page-main-section']}>
            <div className="tw-flex tw-flex-row tw-items-center tw-justify-start tw-mt-4">
              <div className="tw-w-full">
                <Tab
                  text={t(translations.rewardPage.sov.reward)}
                  amountToClaim={rewardSovClaimAmount}
                  active={activeTab === RewardTabType.REWARD_SOV}
                  onClick={() => setActiveTab(RewardTabType.REWARD_SOV)}
                  dataActionId="rewards-claim-rewardsov"
                />
              </div>
              <div className="tw-w-full">
                <Tab
                  text={t(translations.rewardPage.sov.liquid)}
                  active={activeTab === RewardTabType.LIQUID_SOV}
                  onClick={() => setActiveTab(RewardTabType.LIQUID_SOV)}
                  amountToClaim={liquidSovClaimAmount}
                  dataActionId="rewards-claim-liquid"
                />
              </div>
              <div className="tw-w-full">
                <Tab
                  text={t(translations.rewardPage.sov.fee)}
                  active={activeTab === RewardTabType.FEES_EARNED}
                  onClick={() => setActiveTab(RewardTabType.FEES_EARNED)}
                  amountToClaim={totalFeesEarned.toString()}
                  asset={Asset.RBTC}
                  loading={feesLoading}
                  showApproximateSign
                  dataActionId="rewards-claim-feesearned"
                />
              </div>
            </div>
            <div className="tw-flex-1 tw-flex tw-justify-center tw-align-center">
              {activeTab === RewardTabType.REWARD_SOV && (
                <RewardTab
                  availableLendingRewards={availableLendingRewards}
                  availableLiquidityRewards={availableLiquidityRewards}
                  availableTradingRewards={availableTradingRewards}
                  amountToClaim={rewardSovClaimAmount}
                />
              )}
              {activeTab === RewardTabType.LIQUID_SOV && (
                <LiquidTab
                  amountToClaim={liquidSovClaimAmount}
                  lastWithdrawalInterval={lastWithdrawalInterval}
                />
              )}
              {activeTab === RewardTabType.FEES_EARNED && (
                <FeesEarnedTab
                  amountToClaim={totalFeesEarned.toString()}
                  earnedFees={earnedFees}
                  loading={feesLoading}
                />
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
    </>
  );
}
