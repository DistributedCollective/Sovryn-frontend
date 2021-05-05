/**
 *
 * SpotTradingPage
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { selectSpotTradingPage } from './selectors';
import { spotTradingPageSaga } from './saga';
import { translations } from '../../../locales/i18n';

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ChartType, Theme, TradingChart } from '../../components/TradingChart';
import { TradeForm } from './components/TradeForm';
import { SpotHistory } from 'app/containers/SpotHistory';

interface Props {}

export function SpotTradingPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: spotTradingPageSaga });

  const { pairType } = useSelector(selectSpotTradingPage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

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
      <div className="tw-container tw-mt-9 tw-mx-auto tw-px-6">
        <div className="tw-flex tw-flex-col lg:tw-flex-row lg:tw-justify-between">
          <div
            className={
              'tw-flex-shrink tw-w-full tw-flex-grow tw-mb-12 lg:tw-pr-4 lg:tw-mb-0'
            }
          >
            <TradingChart
              symbol={`${pairType}`.replace('_', ':')}
              theme={Theme.DARK}
              type={ChartType.CANDLE}
              inSats
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
