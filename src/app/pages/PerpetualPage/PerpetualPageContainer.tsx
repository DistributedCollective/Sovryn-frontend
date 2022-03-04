import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Tab } from '../../components/Tab';
import { actions as walletProviderActions } from 'app/containers/WalletProvider/slice';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { translations } from 'locales/i18n';

import { reducer, sliceKey, actions } from './slice';
import { perpetualPageSaga } from './saga';
import { HeaderLabs } from '../../components/HeaderLabs';
import { Footer } from '../../components/Footer';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from '../../../utils/dictionaries/perpetual-pair-dictionary';
import { TradingChart } from './components/TradingChart';
import { OpenPositionsTable } from './components/OpenPositionsTable';
import { useIsConnected } from '../../hooks/useAccount';
import { useHistory, useLocation } from 'react-router-dom';
import { IPromotionLinkState } from '../LandingPage/components/Promotions/components/PromotionCard/types';
import { selectPerpetualPage } from './selectors';
import { DataCard } from './components/DataCard';
import { AmmDepthChart } from './components/AmmDepthChart';
import { RecentTradesTable } from './components/RecentTradesTable';
import { ContractDetails } from './components/ContractDetails';
import { isMainnet } from '../../../utils/classifiers';
import { ChainId } from '../../../types';
import { useWalletContext } from '@sovryn/react-wallet';
import { ProviderType } from '@sovryn/wallet';
import { AccountBalanceCard } from './components/AccountBalanceCard';
import { AccountDialog } from './components/AccountDialog';
import { NewPositionCard } from './components/NewPositionCard';
import { TradeDialog } from './components/TradeDialog';
import { EditPositionSizeDialog } from './components/EditPositionSizeDialog';
import { EditLeverageDialog } from './components/EditLeverageDialog';
import { EditMarginDialog } from './components/EditMarginDialog';
import { RecentTradesContextProvider } from './contexts/RecentTradesContext';
import { ClosePositionDialog } from './components/ClosePositionDialog';
import { ClosedPositionsTable } from './components/ClosedPositionsTable';
import { OrderHistoryTable } from './components/OrderHistoryTable/index';
import { FundingPaymentsTable } from './components/FundingPaymentsTable/index';
import { PerpetualQueriesContextProvider } from './contexts/PerpetualQueriesContext';
import { PairSelector } from './components/PairSelector';
import { ToastsWatcher } from './components/ToastsWatcher';

export const PerpetualPageContainer: React.FC = () => {
  useInjectReducer({ key: sliceKey, reducer });
  useInjectSaga({ key: sliceKey, saga: perpetualPageSaga });

  const dispatch = useDispatch();
  const walletContext = useWalletContext();

  const { pairType, collateral } = useSelector(selectPerpetualPage);
  const { t } = useTranslation();

  const location = useLocation<IPromotionLinkState>();
  const history = useHistory<IPromotionLinkState>();

  const [linkPairType, setLinkPairType] = useState(
    location.state?.perpetualPair,
  );

  const pair = useMemo(
    () => PerpetualPairDictionary.get(linkPairType || pairType),
    [linkPairType, pairType],
  );

  const connected = useIsConnected();
  const [activeTab, setActiveTab] = useState(0);

  const onChangePair = useCallback(
    (pairType: PerpetualPairType) => dispatch(actions.setPairType(pairType)),
    [dispatch],
  );

  useEffect(() => {
    setLinkPairType(location.state?.perpetualPair);
    history.replace(location.pathname);

    if (walletContext.provider !== ProviderType.WEB3) {
      walletContext.disconnect();
    }

    //set the bridge chain id to BSC
    dispatch(
      walletProviderActions.setBridgeChainId(
        isMainnet ? ChainId.BSC_MAINNET : ChainId.BSC_TESTNET,
      ),
    );

    return () => {
      // Unset bridge settings
      dispatch(walletProviderActions.setBridgeChainId(null));
      dispatch(actions.reset());
    };

    // only run once on mounting
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RecentTradesContextProvider pair={pair}>
      <PerpetualQueriesContextProvider pair={pair}>
        <Helmet>
          <title>{t(translations.perpetualPage.meta.title)}</title>
          <meta
            name="description"
            content={t(translations.perpetualPage.meta.description)}
          />
        </Helmet>
        <HeaderLabs helpLink="https://wiki.sovryn.app/en/sovryn-dapp/perpetual-futures" />
        <div className="tw-relative tw--top-2.5 tw-w-full">
          <PairSelector
            pair={pair}
            collateral={collateral}
            onChange={onChangePair}
          />
          <ContractDetails pair={pair} collateral={collateral} />
        </div>
        <div className="tw-container tw-mt-5 tw-flex-grow">
          <div className="tw-flex tw-flex-col tw-mb-8 xl:tw-flex-row xl:tw-justify-stretch tw-space-y-2 xl:tw-space-y-0 xl:tw-space-x-2">
            <DataCard
              className="tw-min-w-72 tw-max-w-96 tw-"
              title={`AMM Depth (${pairType.toString()})`}
            >
              <AmmDepthChart pair={pair} />
            </DataCard>
            <DataCard
              className="tw-flex-1 tw-max-w-full tw-min-h-80"
              contentClassName="tw-flex tw-flex-col"
              title={`Chart (${pairType.toString()})`}
            >
              <TradingChart symbol={pair.chartSymbol} hasCustomDimensions />
            </DataCard>
            <DataCard
              className="2xl:tw-flex tw-min-w-72 tw-max-w-96 tw-min-h-72"
              title={`Recent Trades (${pairType.toString()})`}
              contentClassName="tw-flex tw-flex-col"
            >
              <RecentTradesTable pair={pair} />
            </DataCard>
            <div className="tw-flex tw-flex-col xl:tw-min-w-80 xl:tw-w-1/5 tw-space-y-2">
              <AccountBalanceCard />
              <NewPositionCard />
            </div>
          </div>

          {connected && (
            <>
              <div className="tw-flex tw-items-center tw-text-sm">
                <Tab
                  text={t(translations.perpetualPage.openPositions)}
                  active={activeTab === 0}
                  onClick={() => setActiveTab(0)}
                />
                <Tab
                  text={t(translations.perpetualPage.closedPositions)}
                  active={activeTab === 1}
                  onClick={() => setActiveTab(1)}
                />
                <Tab
                  text={t(translations.perpetualPage.orderHistory)}
                  active={activeTab === 2}
                  onClick={() => setActiveTab(2)}
                />
                <Tab
                  text={t(translations.perpetualPage.fundingPayments)}
                  active={activeTab === 3}
                  onClick={() => setActiveTab(3)}
                />
              </div>

              <div className="tw-w-full tw-mb-24">
                {activeTab === 0 && <OpenPositionsTable perPage={5} />}
                {activeTab === 1 && <ClosedPositionsTable perPage={5} />}
                {activeTab === 2 && <OrderHistoryTable perPage={5} />}
                {activeTab === 3 && <FundingPaymentsTable perPage={5} />}
              </div>
            </>
          )}
        </div>
        <Footer />
        <AccountDialog />
        <TradeDialog />
        <EditPositionSizeDialog />
        <EditLeverageDialog />
        <EditMarginDialog />
        <ClosePositionDialog />
        <ToastsWatcher />
      </PerpetualQueriesContextProvider>
    </RecentTradesContextProvider>
  );
};
