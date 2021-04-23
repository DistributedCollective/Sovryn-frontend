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
import { OpenPositionsTable } from './components/OpenPositionsTable';
import { useIsConnected } from '../../hooks/useAccount';
import { TradingHistory } from './components/TradingHistory';

interface Props {}

export function MarginTradePage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: marginTradePageSaga });

  const { pairType } = useSelector(selectMarginTradePage);
  const { t } = useTranslation();

  const pair = TradingPairDictionary.get(pairType);

  const connected = useIsConnected();

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
        <div className="tw-flex tw-flex-col lg:tw-flex-row lg:tw-justify-between">
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

        {connected && (
          <>
            <article className="tw-w-full tw-mt-6">
              <h1 className="tw-text-base tw-normal-case tw-font-normal tw-mb-2 tw-pl-5">
                {t(translations.marginTradePage.openPositions)}
              </h1>
              <div className="tw-px-5 tw-pb-5 tw-border tw-border-white tw-rounded-lg">
                <OpenPositionsTable />
              </div>
            </article>

            <article className="tw-w-full tw-mt-24 tw-px-5">
              <h1 className="tw-text-base tw-normal-case tw-font-normal tw-mb-2 tw-pl-5">
                {t(translations.marginTradePage.tradingHistory)}
              </h1>
              <TradingHistory />
            </article>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
