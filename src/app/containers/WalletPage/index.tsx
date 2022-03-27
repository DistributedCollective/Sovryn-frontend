import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { translations } from '../../../locales/i18n';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { SovGenerationNFTS } from '../../components/SovGenerationNFTS';
import { UserAssets } from '../../components/UserAssets';
import { VestedAssets } from '../../components/UserAssets/VestedAssets';
import { useAccount, useIsConnected } from '../../hooks/useAccount';
import { TopUpHistory } from './components/TopUpHistory';
import { SwapHistory } from '../SwapHistory';
import { VestedHistory } from '../VestedHistory';
import { OriginClaimBanner } from './components/OriginClaimBanner';

import './_overlay.scss';
import { Tabs } from 'app/components/Tabs';

export const WalletPage: React.FC = () => {
  const { t } = useTranslation();
  const connected = useIsConnected();
  const account = useAccount();

  const historyTabs = [
    {
      id: 'topUpHistory',
      label: t(translations.topUpHistory.meta.title),
      content: <TopUpHistory />,
    },
    {
      id: 'swapHistory',
      label: t(translations.swapHistory.title),
      content: <SwapHistory />,
    },
    {
      id: 'vestedHistory',
      label: t(translations.vestedHistory.title),
      content: <VestedHistory />,
    },
  ];

  const walletTabs = [
    {
      id: 'userAssets',
      label: t(translations.walletPage.tabs.userAssets),
      content: <UserAssets />,
    },
    {
      id: 'vestedAssets',
      label: t(translations.walletPage.tabs.vestedAssets),
      content: <VestedAssets />,
    },
    {
      id: 'userNFTS',
      label: t(translations.walletPage.tabs.userNFTS),
      content: <SovGenerationNFTS />,
    },
  ];
  return (
    <>
      <Helmet>
        <title>{t(translations.walletPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.walletPage.meta.description)}
        />
      </Helmet>

      <div className="tw-container tw-mx-auto tw-px-4 tw-mt-4">
        <OriginClaimBanner />
      </div>

      <div
        className="tw-container tw-mx-auto tw-px-4"
        style={{ maxWidth: 1200 }}
      >
        <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-center tw-mb-3">
          <h2 className="tw-flex-shrink-0 tw-flex-grow-0 tw-mb-2 ">
            {t(translations.userAssets.meta.title)}
          </h2>
        </div>
        {connected && account ? (
          <Tabs
            items={walletTabs}
            initial={walletTabs[0].id}
            contentClassName="tw-col-span-12 tw-mt-2"
            dataActionId="portfolio-assets"
          />
        ) : (
          <div className="tw-grid tw-gap-8 tw-grid-cols-12">
            <div className="tw-col-span-12">
              <SkeletonRow
                loadingText={t(translations.topUpHistory.walletHistory)}
                className="tw-mt-2"
              />
            </div>
          </div>
        )}
      </div>
      {connected && account && (
        <Tabs
          items={historyTabs}
          initial={historyTabs[0].id}
          className="tw-container tw-mt-12"
          contentClassName="tw-overflow-auto"
          dataActionId="portfolio-history"
        />
      )}
    </>
  );
};
