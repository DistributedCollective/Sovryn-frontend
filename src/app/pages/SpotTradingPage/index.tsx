/**
 *
 * SpotTradingPage
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { selectSpotTradingPage } from './selectors';
import { spotTradingPageSaga } from './saga';
import { translations } from '../../../locales/i18n';
import cn from 'classnames';

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Theme, TradingChart } from '../../components/TradingChart';
import { TradeForm } from './components/TradeForm';
import { SpotHistory } from 'app/containers/SpotHistory';
import { PriceHistory } from './components/PriceHistory';

export function SpotTradingPage() {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: spotTradingPageSaga });

  const { t } = useTranslation();
  const { pairType } = useSelector(selectSpotTradingPage);

  return (
    <>
      <Helmet>
        <title>{t(translations.spotTradingPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.spotTradingPage.meta.description)}
        />
      </Helmet>
      <Header />
      <div
        className={cn('tw-container tw-mt-9 tw-mx-auto tw-px-6', {
          'tw-hidden': !pairType.includes('SOV'),
        })}
      >
        <PriceHistory />
      </div>
      <div className="tw-container tw-mt-9 tw-mx-auto tw-px-6">
        <div className="tw-flex tw-flex-col lg:tw-flex-row lg:tw-justify-between">
          <div
            className={
              'tw-flex-shrink tw-w-full tw-flex-grow tw-mb-12 lg:tw-pr-4 lg:tw-mb-0'
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
          <div className="tw-px-3">Spot History</div>
          <SpotHistory />
        </div>
      </div>
      <Footer />
    </>
  );
}
