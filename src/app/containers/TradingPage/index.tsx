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
import Header from '../LendBorrowSovryn/components/Header';
import { TradingViewChart } from '../../components/TradingViewChart';
import { TradingPairDictionary } from '../../../utils/trading-pair-dictionary';
import { TradeOrSwapTabs } from '../../components/TradeOrSwapTabs/Loadable';

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
  const { t, i18n } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t(s.meta.title)}</title>
        <meta name="description" content={t(s.meta.description)} />
      </Helmet>
      <>
        <Header />

        <div className="container mt-5">
          <div className="row">
            <div className="col-12 col-lg-6 order-lg-1 pl-lg-5">
              <TradingViewChart pair={tradingPage.tradingPair} />
            </div>
            <div className="col-12 col-lg-6 mt-5 mt-lg-0 order-lg-0 pr-lg-5">
              <TradingPairSelector />
              <TradeOrSwapTabs />
            </div>
          </div>
        </div>
      </>
    </>
  );
}
