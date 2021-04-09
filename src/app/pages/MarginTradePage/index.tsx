/**
 *
 * MarginTradePage
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { translations } from 'locales/i18n';

import { reducer, sliceKey } from './slice';
import { selectMarginTradePage } from './selectors';
import { marginTradePageSaga } from './saga';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { TradingPairDictionary } from '../../../utils/dictionaries/trading-pair-dictionary';

import { TradeForm } from './components/TradeForm';
import { ChartType, Theme, TradingChart } from '../../components/TradingChart';

interface Props {}

export function MarginTradePage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: marginTradePageSaga });

  const { pairType } = useSelector(selectMarginTradePage);
  const { t } = useTranslation();

  const pair = TradingPairDictionary.get(pairType);

  return (
    <>
      <Helmet>
        <title>{t(translations.marginTradePage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.marginTradePage.meta.description)}
        />
      </Helmet>
      <Header />
      <div className="tw-container tw-mt-9 tw-mx-auto tw-px-6">
        <div className="tw-flex tw-flex-col tw-items-center lg:tw-flex-row lg:tw-justify-between">
          <div
            className={
              'tw-flex-shrink tw-w-full tw-flex-grow tw-mb-12 lg:tw-pr-4 lg:tw-mb-0'
            }
          >
            <TradingChart
              symbol={pair.chartSymbol}
              theme={Theme.DARK}
              type={ChartType.CANDLE}
            />
          </div>
          <TradeForm />
        </div>
      </div>
      <Footer />
    </>
  );
}
