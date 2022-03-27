/**
 *
 * SpotTradingPage
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import cn from 'classnames';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { selectSpotTradingPage } from './selectors';
import { spotTradingPageSaga } from './saga';
import { translations } from '../../../locales/i18n';

import { Theme, TradingChart } from '../../components/TradingChart';
import { TradeForm } from './components/TradeForm';
import { SpotHistory } from 'app/containers/SpotHistory';
import { PriceHistory } from './components/PriceHistory';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { useAccount } from 'app/hooks/useAccount';

export function SpotTradingPage() {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: spotTradingPageSaga });

  const { t } = useTranslation();
  const { pairType } = useSelector(selectSpotTradingPage);
  const account = useAccount();

  return (
    <>
      <Helmet>
        <title>{t(translations.spotTradingPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.spotTradingPage.meta.description)}
        />
      </Helmet>
      <div
        className={cn('tw-container tw-mt-9 tw-mx-auto tw-px-6', {
          'tw-hidden': !pairType.includes('SOV'),
        })}
      >
        <PriceHistory />
      </div>
      <div className="tw-container tw-mt-9 tw-mx-auto tw-px-6">
        <div className="tw-flex tw-flex-col xl:tw-flex-row xl:tw-justify-between">
          <div
            className={
              'tw-flex-shrink tw-flex-grow tw-mb-12 xl:tw-pr-4 xl:tw-mb-0'
            }
          >
            <TradingChart
              symbol={`${pairType}`.replace('_', '/')}
              theme={Theme.DARK}
            />
          </div>
          <div>
            <TradeForm />
          </div>
        </div>
        <div className="tw-mt-10">
          <div className="tw-px-3">{t(translations.spotHistory.title)}</div>
          {!account ? (
            <SkeletonRow
              loadingText={t(translations.topUpHistory.walletHistory)}
              className="tw-mt-2"
            />
          ) : (
            <SpotHistory />
          )}
        </div>
      </div>
    </>
  );
}
