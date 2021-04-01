/**
 *
 * TradingPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { translations } from 'locales/i18n';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { reducer, sliceKey } from './slice';
import { selectTradingPage } from './selectors';
import { tradingPageSaga } from './saga';
import { TradingPairSelector } from '../TradingPairSelector/Loadable';
import { TradingChart, Theme, ChartType } from '../../components/TradingChart';
import { TradeOrSwapTabs } from '../../components/TradeOrSwapTabs/Loadable';
import { TradingActivity } from '../TradingActivity/Loadable';
import { Header } from 'app/components/Header';
import { Footer } from '../../components/Footer';
import { TabType } from './types';
import { TradingPairDictionary } from '../../../utils/dictionaries/trading-pair-dictionary';
const s = translations.tradingPage;

interface Props {}

export function TradingPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: tradingPageSaga });

  const tradingPage = useSelector(selectTradingPage);
  const { t } = useTranslation();

  const symbol = TradingPairDictionary.get(
    tradingPage.tradingPair,
  )?.getChartSymbol();

  return (
    <>
      <Helmet>
        <title>{t(s.meta.title)}</title>
        <meta name="description" content={t(s.meta.description)} />
      </Helmet>
      <Header />
      <div className="tw-container tw-mx-auto tw-px-4 tw-mt-12">
        <div className="tw-grid lg:tw-gap-8 tw-grid-cols-1 lg:tw-grid-cols-2">
          <div
            className={`tw-mb-12 lg:tw-mb-0 lg:tw-order-1 tw-hidden ${
              tradingPage.isMobileStatsOpen && `tw-block`
            } lg:tw-block`}
          >
            <TradingChart
              symbol={symbol}
              theme={Theme.DARK}
              type={ChartType.CANDLE}
            />
          </div>
          <div className="lg:tw-order-0">
            {tradingPage.tab === TabType.TRADE && <TradingPairSelector />}
            <TradeOrSwapTabs />
          </div>
        </div>
        <div className="tw-grid tw-gap-8 tw-grid-cols-1">
          <TradingActivity />
        </div>
      </div>
      <Footer />
    </>
  );
}
