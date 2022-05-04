import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Tab } from '../../components/Tab';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { translations } from 'locales/i18n';
import { RecentTrades, RecentTradeType } from 'app/components/RecentTrades';
import { reducer, sliceKey } from './slice';
import { selectMarginTradePage } from './selectors';
import { marginTradePageSaga } from './saga';
import { TradingPairDictionary } from '../../../utils/dictionaries/trading-pair-dictionary';
import { TradeForm } from './components/TradeForm';
import { Theme, TradingChart } from '../../components/TradingChart';
import { useIsConnected } from '../../hooks/useAccount';
import { ClosedPositionsTable } from './components/ClosedPositionsTable';
import { useHistory, useLocation } from 'react-router-dom';
import { IPromotionLinkState } from '../LandingPage/components/Promotions/components/PromotionCard/types';
import { PairNavbar } from 'app/components/PairNavbar';
import { TradingType } from 'types/trading-pairs';
// import { LimitOrderTables } from './components/LimitOrder/LimitOrderTables';
import { OpenPositionsTable } from './components/OpenPositionsTable/OpenPositionsTable';

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
  }, [history, location.pathname, location.state?.marginTradingPair]);

  const pair = useMemo(
    () => TradingPairDictionary.get(linkPairType || pairType),
    [linkPairType, pairType],
  );

  const connected = useIsConnected();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <Helmet>
        <title>{t(translations.marginTradePage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.marginTradePage.meta.description)}
        />
      </Helmet>
      <div className="tw-h-10 tw-flex tw-items-center tw-justify-between tw-bg-gray-3">
        <PairNavbar type={TradingType.MARGIN} />
      </div>
      <div className="tw-container tw-mx-auto">
        <div className="tw-flex tw-mt-5 tw-flex-col md:tw-flex-row xl:tw-justify-between tw-max-w-full md:tw-flex-wrap">
          <div
            className={
              'tw-flex-shrink tw-flex-grow tw-mb-12 tw-max-w-none xl:tw-pr-4 xl:tw-mb-0 xl:tw-w-auto tw-w-full'
            }
          >
            <TradingChart symbol={pair.chartSymbol} theme={Theme.DARK} />
          </div>
          <div className="tw-trading-form-card tw-bg-black tw-rounded-2xl tw-px-4 tw-py-3 tw-mx-auto md:tw-mb-0 tw-mb-4 xl:tw-mr-2 tw-relative">
            <RecentTrades
              baseToken={pair.collaterals[0]}
              quoteToken={pair.collaterals[1]}
              type={RecentTradeType.MARGIN}
            />
          </div>
          <TradeForm pairType={linkPairType || pairType} />
        </div>

        {connected && (
          <>
            <div className="sm:tw-flex tw-items-center tw-mt-3 tw-text-sm sm:tw-text-left tw-text-center">
              <Tab
                text={t(translations.marginTradePage.openPositions)}
                active={activeTab === 0}
                onClick={() => setActiveTab(0)}
              />
              <Tab
                text={t(translations.marginTradePage.tradingHistory)}
                active={activeTab === 1}
                onClick={() => setActiveTab(1)}
              />
              {/* <Tab
                text={t(translations.spotTradingPage.history.openLimitOrders)}
                active={activeTab === 2}
                onClick={() => setActiveTab(2)}
              /> */}
              {/* <Tab
                text={t(translations.spotTradingPage.history.limitOrderHistory)}
                active={activeTab === 3}
                onClick={() => setActiveTab(3)}
              /> */}
            </div>

            <div className="tw-w-full sm:tw-px-5">
              {activeTab === 0 && <OpenPositionsTable />}
              {activeTab === 1 && <ClosedPositionsTable />}

              {/* <LimitOrderTables activeTab={activeTab} /> */}
            </div>
          </>
        )}
      </div>
    </>
  );
}
