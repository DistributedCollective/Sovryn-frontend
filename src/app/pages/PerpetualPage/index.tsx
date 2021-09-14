import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Tab } from '../../components/Tab';

import { useInjectReducer } from 'utils/redux-injectors';
import { translations } from 'locales/i18n';

import { reducer, sliceKey } from './slice';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { PerpetualPairDictionary } from '../../../utils/dictionaries/perpatual-pair-dictionary';
import { TradeForm } from './components/TradeForm';
import { Theme, TradingChart } from '../../components/TradingChart';
import { OpenPositionsTable } from './components/OpenPositionsTable';
import { useIsConnected } from '../../hooks/useAccount';
import { TradingHistory } from './components/TradingHistory';
import { useHistory, useLocation } from 'react-router-dom';
import { IPromotionLinkState } from '../LandingPage/components/Promotions/components/PromotionCard/types';
import { NotificationSettingsDialog } from './components/NotificationSettingsDialog';
import { selectPerpetualPage } from './selectors';
import { DataCard } from './components/DataCard';

export function PerpetualPage() {
  useInjectReducer({ key: sliceKey, reducer: reducer });

  const [
    showNotificationSettingsModal,
    setShowNotificationSettingsModal,
  ] = useState(false);

  const { pairType } = useSelector(selectPerpetualPage);
  const { t } = useTranslation();

  const location = useLocation<IPromotionLinkState>();
  const history = useHistory<IPromotionLinkState>();

  const [linkPairType, setLinkPairType] = useState(
    location.state?.perpetualPair,
  );

  useEffect(() => {
    setLinkPairType(location.state?.perpetualPair);
    history.replace(location.pathname);
    // only run once on mounting
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pair = useMemo(
    () => PerpetualPairDictionary.get(linkPairType || pairType),
    [linkPairType, pairType],
  );

  const connected = useIsConnected();
  const [activeTab, setActiveTab] = useState(0);

  const onNotificationSettingsClick = useCallback(
    () => setShowNotificationSettingsModal(true),
    [],
  );

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
      <div className="tw-w-full tw-bg-gray-2 tw-py-2">
        <div className="tw-container">
          <div>Pair Select Placeholder{/*TODO: implement pair select*/}</div>
        </div>
      </div>
      <div className="tw-w-full tw-bg-black tw-py-2">
        <div className="tw-container">
          <div>
            Contract Details Placeholder
            {/*TODO: implement contract details bar*/}
          </div>
        </div>
      </div>
      <div className="tw-container tw-mt-5">
        <div className="tw-flex tw-flex-col xl:tw-flex-row xl:tw-justify-stretch tw-space-y-2 xl:tw-space-y-0 xl:tw-space-x-2 tw-mb-8">
          <DataCard
            className="xl:tw-w-1/6"
            title={`AMM Depth (${pairType.toString()})`}
          >
            {/*TODO: implement AMM Depth Graph*/}
          </DataCard>
          <div className="tw-flex tw-flex-col xl:tw-w-1/3 tw-max-w-none tw-space-y-2">
            <DataCard title={`Chart (${pairType.toString()})`}>
              <TradingChart symbol={pair.chartSymbol} theme={Theme.DARK} />
            </DataCard>
            <DataCard title={`Depth Chart (${pairType.toString()})`}>
              {/*TODO: implement Depth Chart Graph*/}
            </DataCard>
          </div>
          <DataCard
            className="tw-flex-grow xl:tw-w-1/6"
            title={`Recent Trades (${pairType.toString()})`}
          >
            {/*TODO: implement Recent Trades Graph*/}
          </DataCard>
          <TradeForm pairType={linkPairType || pairType} />
        </div>

        {connected && (
          <>
            <div className="tw-flex tw-items-center tw-text-sm">
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
            </div>

            <div className="tw-w-full tw-mb-24">
              {activeTab === 0 && <OpenPositionsTable />}
              {activeTab === 1 && <TradingHistory />}
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
