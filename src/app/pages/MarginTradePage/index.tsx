import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Tab } from '../../components/Tab';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { translations } from 'locales/i18n';
import { RecentTradesTable } from './components/RecentTradesTable';
import { reducer, sliceKey } from './slice';
import { selectMarginTradePage } from './selectors';
import { marginTradePageSaga } from './saga';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { TradingPairDictionary } from '../../../utils/dictionaries/trading-pair-dictionary';
import { TradeForm } from './components/TradeForm';
import { Theme, TradingChart } from '../../components/TradingChart';
import { OpenPositionsTable } from './components/OpenPositionsTable';
import { useIsConnected } from '../../hooks/useAccount';
import { TradingHistory } from './components/TradingHistory';
import { useHistory, useLocation } from 'react-router-dom';
import { IPromotionLinkState } from '../LandingPage/components/Promotions/components/PromotionCard/types';
import styles from './index.module.scss';
import { NotificationSettingsDialog } from './components/NotificationSettingsDialog';
import { PairNavbar } from './components/PairNavbar';
import { LimitOrderTables } from './components/LimitOrderTables';

export function MarginTradePage() {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: marginTradePageSaga });

  const [
    showNotificationSettingsModal,
    setShowNotificationSettingsModal,
  ] = useState(false);

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
      <Header />
      <div className={styles.overview}>
        <PairNavbar />
      </div>
      <div className="tw-container tw-mt-5 tw-mx-auto tw-px-3">
        <div className="tw-flex tw-flex-col xl:tw-flex-row xl:tw-justify-between tw-max-w-full">
          <div
            className={
              'tw-flex-shrink tw-flex-grow tw-mb-12 tw-max-w-none xl:tw-pr-4 xl:tw-mb-0'
            }
          >
            <TradingChart symbol={pair.chartSymbol} theme={Theme.DARK} />
          </div>
          <div
            className="tw-trading-recent-trades-card tw-bg-black tw-rounded-3xl tw-p-4 tw-mx-auto xl:tw-mr-2 tw-relative"
            title={
              t(translations.marginTradePage.recentTrades.title) +
              ` (${pairType.toString()})`
            }
          >
            <RecentTradesTable pair={pair} />
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
              <Tab
                text={t(translations.spotTradingPage.history.openLimitOrders)}
                active={activeTab === 2}
                onClick={() => setActiveTab(2)}
              />
              <Tab
                text={t(translations.spotTradingPage.history.limitOrderHistory)}
                active={activeTab === 3}
                onClick={() => setActiveTab(3)}
              />
            </div>

            <div className="tw-w-full sm:tw-px-5">
              {activeTab === 0 && <OpenPositionsTable />}
              {activeTab === 1 && <TradingHistory />}
              <LimitOrderTables activeTab={activeTab} />
            </div>
          </>
        )}
      </div>
      <Footer />
      <NotificationSettingsDialog
        isOpen={showNotificationSettingsModal}
        onClose={() => setShowNotificationSettingsModal(false)}
      />
    </>
  );
}
