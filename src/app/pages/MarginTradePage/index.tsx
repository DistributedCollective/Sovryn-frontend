import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { translations } from 'locales/i18n';

import { reducer, sliceKey } from './slice';
import { selectMarginTradePage } from './selectors';
import { marginTradePageSaga } from './saga';
import { TradingPairDictionary } from '../../../utils/dictionaries/trading-pair-dictionary';

import { TradeForm } from './components/TradeForm';
import { Theme, TradingChart } from '../../components/TradingChart';
import { OpenPositionsTable } from './components/OpenPositionsTable';
import { useIsConnected } from '../../hooks/useAccount';
import { TradingHistory } from './components/TradingHistory';
import { useHistory, useLocation } from 'react-router-dom';
import { IPromotionLinkState } from '../LandingPage/components/Promotions/components/PromotionCard/types';

export function MarginTradePage() {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: marginTradePageSaga });

  const { pairType } = useSelector(selectMarginTradePage);
  const { t } = useTranslation();

  const location = useLocation<IPromotionLinkState>();
  const history = useHistory<IPromotionLinkState>();

  const [linkPairType, setLinkPairType] = useState(
    location.state?.marginTradingPair,
  );

  useEffect(() => {
    setLinkPairType(location.state?.marginTradingPair);
    history.replace(location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pair = useMemo(
    () => TradingPairDictionary.get(linkPairType || pairType),
    [linkPairType, pairType],
  );

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
      <div className="tw-container tw-mt-9 tw-mx-auto tw-px-6">
        <div className="tw-flex tw-flex-col xl:tw-flex-row xl:tw-justify-between tw-max-w-full">
          <div
            className={
              'tw-flex-shrink tw-flex-grow tw-mb-12 tw-max-w-none xl:tw-pr-4 xl:tw-mb-0'
            }
          >
            <TradingChart symbol={pair.chartSymbol} theme={Theme.DARK} />
          </div>
          <TradeForm pairType={linkPairType || pairType} />
        </div>

        {connected && (
          <>
            <article className="tw-w-full tw-mt-10">
              <h1 className="tw-text-base tw-normal-case tw-font-normal tw-mb-2 tw-pl-5">
                {t(translations.marginTradePage.openPositions)}
              </h1>
              <div className="tw-px-5 tw-pb-5 tw-border tw-border-sov-white tw-rounded-lg">
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
    </>
  );
}
