import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { useAccount } from 'app/hooks/useAccount';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { translations } from 'locales/i18n';

import { weiTo18 } from '../../../utils/blockchain/math-helpers';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { HistoryTable } from './components/HistoryTable';
import { LiquidForm } from './components/LiquidForm';
import { RewardForm } from './components/RewardForm';
import { Tab } from './components/Tab';
import { RewardTabType } from './types';
import { contractReader } from 'utils/sovryn/contract-reader';
import { weiToNumberFormat } from 'utils/display-text/format';

import imgSov from 'assets/images/reward/sov.svg';
import imgBtc from 'assets/images/reward/Bitcoin.svg';
import { StyledBackgroundImageWrapper } from './styled';

export function RewardPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(RewardTabType.REWARD_SOV);
  const [liquidSovClaimAmount, setLiquidSovClaimAmount] = useState('0');
  const address = useAccount();

  useEffect(() => {
    contractReader
      .call<{ amount: string }>(
        'stakingRewards',
        'getStakerCurrentReward',
        [true],
        address,
      )
      .then(result => setLiquidSovClaimAmount(result.amount))
      .catch(() => setLiquidSovClaimAmount('0'));
  }, [address]);

  const { value: lockedBalance } = useCacheCallWithValue(
    'lockedSov',
    'getLockedBalance',
    '',
    address,
  );

  const rewardSov =
    parseFloat(weiTo18(lockedBalance)).toFixed(6).toString() + ' SOV';

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

      <StyledBackgroundImageWrapper>
        <img src={imgSov} alt="SOV" />
        <img src={imgBtc} alt="BTC" />
      </StyledBackgroundImageWrapper>

      <div className="tw-container tw-mt-9 tw-mx-auto tw-px-6 tw-relative">
        <div className="tw-mt-4 tw-items-center tw-flex tw-flex-col">
          <div className="tw-w-230">
            <div className="tw-flex tw-flex-row tw-items-center tw-justify-start tw-mt-24">
              <div className="tw-w-full">
                <Tab
                  text={t(translations.rewardPage.sov.reward)}
                  amount={rewardSov}
                  active={activeTab === RewardTabType.REWARD_SOV}
                  onClick={() => setActiveTab(RewardTabType.REWARD_SOV)}
                />
              </div>
              <div className="tw-w-full">
                <Tab
                  text={t(translations.rewardPage.sov.liquid)}
                  active={activeTab === RewardTabType.LIQUID_SOV}
                  onClick={() => setActiveTab(RewardTabType.LIQUID_SOV)}
                  amount={`${weiToNumberFormat(liquidSovClaimAmount, 6)} SOV`}
                />
              </div>
              <div className="tw-w-full">
                <Tab
                  text={t(translations.rewardPage.sov.fee)}
                  isDisabled
                  amount="Coming soon"
                />
              </div>
            </div>
            <div className="tw-flex-1 tw-flex tw-justify-center tw-align-center">
              {activeTab === RewardTabType.REWARD_SOV && (
                <RewardForm amountToClaim={lockedBalance} />
              )}
              {activeTab === RewardTabType.LIQUID_SOV && (
                <LiquidForm amountToClaim={liquidSovClaimAmount} />
              )}
            </div>
          </div>
          <div className="tw-flex-1 tw-mt-12 tw-w-full">
            <div className="tw-px-3 tw-text-lg">
              {t(translations.rewardPage.historyTable.title)}
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
