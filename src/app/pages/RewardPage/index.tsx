/**
 *
 * RewardPage
 *
 */

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { useAccount } from 'app/hooks/useAccount';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { translations } from 'locales/i18n';

import { weiTo18 } from '../../../utils/blockchain/math-helpers';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { FeeForm } from './components/FeeForm';
import { HistoryTable } from './components/HistoryTable';
import { LiquidForm } from './components/LiquidForm';
import { RewardForm } from './components/RewardForm';
import { Tab } from './components/Tab';

export function RewardPage() {
  const { t } = useTranslation();
  const [activeAssets, setActiveAssets] = useState(0);
  // const [activeHistory, setActiveHistory] = useState(0);
  // const connected = useIsConnected();
  const address = useAccount();
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

      <div className="tw-container tw-mt-9 tw-mx-auto tw-px-6">
        <div className="tw-mt-4 tw-items-center tw-flex tw-flex-col">
          {/* <ClaimForm address={userAddress} /> */}
          <div className="tw-flex tw-w-1/2 tw-flex-row tw-items-center tw-justify-start">
            <div className="tw-w-full">
              <Tab
                text={t(translations.rewardPage.sov.reward)}
                amount={rewardSov}
                active={activeAssets === 0}
                onClick={() => setActiveAssets(0)}
              />
            </div>
            <div className="tw-w-full">
              <Tab
                text={t(translations.rewardPage.sov.liquid)}
                active={activeAssets === 1}
                onClick={() => setActiveAssets(1)}
                amount="32.274693 SOV"
              />
            </div>
            <div className="tw-w-full">
              <Tab
                text={t(translations.rewardPage.sov.fee)}
                active={activeAssets === 2}
                onClick={() => setActiveAssets(2)}
                amount="0.02918284 RBTC"
              />
            </div>
          </div>
          <div className="tw-flex-1 tw-w-1/2 tw-flex tw-justify-center tw-align-center">
            {activeAssets === 0 && <RewardForm />}
            {activeAssets === 1 && <LiquidForm />}
            {activeAssets === 2 && <FeeForm />}
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
              <HistoryTable rewardType={activeAssets} />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
