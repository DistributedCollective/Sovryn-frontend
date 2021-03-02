/**
 *
 * MarginTradePage
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import classNames from 'classnames';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { translations } from 'locales/i18n';

import { reducer, sliceKey } from './slice';
import { selectMarginTradePage } from './selectors';
import { marginTradePageSaga } from './saga';
import { Header } from '../../components/Header';
import { TradingViewChart } from '../../components/TradingViewChart';
import { Footer } from '../../components/Footer';
import { TradingPairDictionary } from '../../../utils/dictionaries/trading-pair-dictionary';

import styles from './index.module.css';
import { TradeForm } from './components/TradeForm';

interface Props {}

export function MarginTradePage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: marginTradePageSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { pairType, collateral } = useSelector(selectMarginTradePage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

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
      <div className="tw-container tw-mt-9 tw-mx-auto tw-px-4">
        <div className="tw-flex tw-flex-col tw-items-center lg:tw-flex-row lg:tw-justify-between">
          <div
            className={classNames(
              'tw-flex-shrink tw-flex-grow lg:tw-pr-3',
              styles.chartWrapper,
            )}
          >
            <TradingViewChart symbol={pair.getChartSymbol()} />
          </div>
          <TradeForm />
        </div>
      </div>
      <Footer />
    </>
  );
}
