/**
 *
 * TradingPage
 *
 */

import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { translations } from 'locales/i18n';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { reducer, sliceKey } from './slice';
import { selectTradingPage } from './selectors';
import { tradingPageSaga } from './saga';
import { TradingPairSelector } from '../TradingPairSelector/Loadable';
import { ChartType, Theme, TradingChart } from '../../components/TradingChart';
import { TradeOrSwapTabs } from '../../components/TradeOrSwapTabs/Loadable';
import { TradingActivity } from '../TradingActivity/Loadable';
import { Header } from 'app/components/Header';
import { Footer } from '../../components/Footer';
import { TabType } from './types';
import { TradingPairDictionary } from '../../../utils/dictionaries/trading-pair-dictionary';
import { WhitelistedNotification } from '../../components/WhitelistedNotification/Loadable';

const s = translations.tradingPage;

interface Props {}

const fixPair = {
  'USDT:RBTC': 'RBTC:USDT',
  'DOC:RBTC': 'RBTC:DOC',
  'SOV:RBTC': 'RBTC:SOV',
  'SOV:DOC': 'RBTC:SOV',
  'SOV:USDT': 'RBTC:SOV',
  'SOV:BPRO': 'RBTC:SOV',
  'DOC:SOV': 'RBTC:SOV',
  'USDT:SOV': 'RBTC:SOV',
  'BPRO:SOV': 'RBTC:SOV',
};

function getSwapPair(pair: string) {
  if (fixPair.hasOwnProperty(pair)) {
    return fixPair[pair];
  }
  return pair;
}

export function TradingPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: tradingPageSaga });

  const tradingPage = useSelector(selectTradingPage);
  const { t } = useTranslation();

  const symbol = useMemo(() => {
    if (tradingPage.tab === TabType.TRADE) {
      return TradingPairDictionary.get(
        tradingPage.tradingPair,
      )?.getChartSymbol();
    } else {
      return getSwapPair(tradingPage.swapPair);
    }
  }, [tradingPage.tab, tradingPage.tradingPair, tradingPage.swapPair]);

  return (
    <>
      <Helmet>
        <title>{t(s.meta.title)}</title>
        <meta name="description" content={t(s.meta.description)} />
      </Helmet>
      <Header />
      <WhitelistedNotification />
      <div className="container mt-5">
        <div className="row">
          <div
            className={`mb-5 mb-lg-0 col-12 col-lg-6 order-lg-1 d-none ${
              tradingPage.isMobileStatsOpen && `d-block`
            } d-lg-block`}
          >
            <TradingChart
              symbol={symbol}
              theme={Theme.DARK}
              type={ChartType.CANDLE}
            />
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
