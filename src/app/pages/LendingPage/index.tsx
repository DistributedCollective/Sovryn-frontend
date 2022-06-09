import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Asset } from 'types';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { useAccount } from '../../hooks/useAccount';
import CurrencyContainer from './components/CurrencyContainer';
import { HistoryTable } from './components/HistoryTable';
import { getNextMonday } from '../../../utils/dateHelpers';
import { PromotionCard } from 'app/components/Promotions/components/PromotionCard';
import {
  AppSection,
  PromotionColor,
} from 'app/components/Promotions/components/PromotionCard/types';
import { learnMoreLending } from 'utils/classifiers';

const date = getNextMonday();

const LendingPage: React.FC = () => {
  const { t } = useTranslation();
  const account = useAccount();

  return (
    <>
      <Helmet>
        <title>{t(translations.lendingPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.lendingPage.meta.description)}
        />
      </Helmet>
      <div className="tw-max-w-screen-2xl tw-mx-auto tw-container 2xl:tw-px-0 tw-w-full">
        <PromotionCard
          appSection={AppSection.Lend}
          backgroundColor={PromotionColor.Yellow}
          title={t(translations.promotions.card2.title)}
          text={t(translations.promotions.card2.text)}
          duration={t(translations.liquidityMining.recalibration, {
            date,
          })}
          linkAsset={Asset.XUSD}
          learnMoreLink={learnMoreLending}
          logoAsset1={Asset.XUSD}
          linkDataActionId={`lend-promo-learnmore-${Asset.XUSD}`}
        />

        <div className={'tw-max-w-screen-2xl tw-mx-auto tw-mt-5'}>
          <CurrencyContainer />
        </div>

        <div className="tw-mt-12">
          <div className="tw-px-3 tw-text-lg">
            {t(translations.lendingPage.historyTable.title)}
          </div>
          {!account ? (
            <SkeletonRow
              loadingText={t(translations.topUpHistory.walletHistory)}
              className="tw-mt-2"
            />
          ) : (
            <HistoryTable />
          )}
        </div>
      </div>
    </>
  );
};

export default LendingPage;
