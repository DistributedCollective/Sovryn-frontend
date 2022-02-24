import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import classNames from 'classnames';

import { Tab } from '../../components/Tab';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import {
  reducer as marginReducer,
  sliceKey as marginSliceKey,
} from '../MarginTradePage/slice';
import { selectSpotTradingPage } from './selectors';
import { spotTradingPageSaga } from './saga';
import { translations } from '../../../locales/i18n';

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Theme, TradingChart } from '../../components/TradingChart';
import { TradeForm } from './components/TradeForm';
import { useAccount } from 'app/hooks/useAccount';
import { PairNavbar } from 'app/components/PairNavbar';
import { LimitOrderTables } from './components/LimitOrderTables';
import { SpotHistory } from './components/SpotHistory';
import { TradingType } from 'types/trading-pairs';
import { RecentTrades } from 'app/components/RecentTrades';
import { getSpotPairs } from './types';

export function SpotTradingPage() {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectReducer({ key: marginSliceKey, reducer: marginReducer });
  useInjectSaga({ key: sliceKey, saga: spotTradingPageSaga });

  const [activeTab, setActiveTab] = useState(0);

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
      <Header />
      <div className="tw-h-10 tw-flex tw-items-center tw-justify-between tw-bg-gray-3">
        <PairNavbar type={TradingType.SPOT} />
      </div>
      <div className="tw-container tw-mx-auto">
        <div className="tw-flex tw-mt-5 tw-flex-col md:tw-flex-row xl:tw-justify-between tw-max-w-full md:tw-flex-wrap">
          <div
            className={
              'tw-flex-shrink tw-flex-grow tw-mb-12 tw-max-w-none xl:tw-pr-4 xl:tw-mb-0 xl:tw-w-auto tw-w-full'
            }
          >
            <TradingChart
              symbol={`${pairType}`.replace('_', '/')}
              theme={Theme.DARK}
            />
          </div>
          <div className="tw-trading-recent-trades-card tw-bg-black tw-rounded-2xl tw-px-4 tw-py-3 tw-mx-auto xl:tw-mr-2 tw-relative">
            <RecentTrades
              baseToken={getSpotPairs(pairType)[0]}
              quoteToken={getSpotPairs(pairType)[1]}
            />
          </div>
          <TradeForm />
        </div>

        {account && (
          <div className="tw-mt-10">
            <div className="sm:tw-flex tw-items-center tw-mt-3 tw-text-sm sm:tw-text-left tw-text-center">
              <Tab
                text={t(translations.spotTradingPage.history.marketOrder)}
                active={activeTab === 0}
                onClick={() => setActiveTab(0)}
              />
              <Tab
                text={t(translations.spotTradingPage.history.openLimitOrders)}
                active={activeTab === 1}
                onClick={() => setActiveTab(1)}
              />
              <Tab
                text={t(translations.spotTradingPage.history.limitOrderHistory)}
                active={activeTab === 2}
                onClick={() => setActiveTab(2)}
              />
            </div>

            <div className="tw-w-full sm:tw-px-5 tw-mb-10">
              <div className={classNames({ 'tw-hidden': activeTab !== 0 })}>
                <SpotHistory />
              </div>
              <LimitOrderTables activeTab={activeTab} />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
