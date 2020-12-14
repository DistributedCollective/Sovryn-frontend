/**
 *
 * TradingPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { translations } from 'locales/i18n';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { reducer, sliceKey } from './slice';
import { selectTradingPage } from './selectors';
import { tradingPageSaga } from './saga';
import { TradingPairSelector } from '../TradingPairSelector/Loadable';
import { TradingViewChart } from '../../components/TradingViewChart';
import { TradeOrSwapTabs } from '../../components/TradeOrSwapTabs/Loadable';
import { TradingActivity } from '../TradingActivity/Loadable';
import { Header } from 'app/components/Header';
import { Footer } from '../../components/Footer';
import { TabType } from './types';
import { Announcement } from '../../components/Announcement';
import { TradingPairDictionary } from '../../../utils/dictionaries/trading-pair-dictionary';

const s = translations.tradingPage;

interface Props {}

export function TradingPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: tradingPageSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tradingPage = useSelector(selectTradingPage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      <div className="container mt-5">
        <Announcement />
        <div className="row">
          <div
            className={`mb-5 mb-lg-0 col-12 col-lg-6 order-lg-1 d-none ${
              tradingPage.isMobileStatsOpen && `d-block`
            } d-lg-block`}
          >
            <TradingViewChart symbol={symbol} />
          </div>
          <div className="col-12 col-lg-6 order-lg-0">
            {tradingPage.tab === TabType.TRADE && <TradingPairSelector />}
            <TradeOrSwapTabs />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <TradingActivity />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
