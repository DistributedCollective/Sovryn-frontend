import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { actions as walletProviderActions } from 'app/containers/WalletProvider/slice';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { translations } from 'locales/i18n';

import { reducer, sliceKey, actions } from './slice';
import { perpetualPageSaga } from './saga';
import { HeaderLabs } from '../../components/HeaderLabs';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from '../../../utils/dictionaries/perpetual-pair-dictionary';
import { TradingChart } from './components/TradingChart';
import { OpenPositionsTable } from './components/OpenPositionsTable';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { IPromotionLinkState } from '../../components/Promotions/components/PromotionCard/types';
import { selectPerpetualPage } from './selectors';
import { DataCard } from './components/DataCard';
import { AmmDepthChart } from './components/AmmDepthChart';
import { RecentTradesTable } from './components/RecentTradesTable';
import { ContractDetails } from './components/ContractDetails';
import {
  isMainnet,
  WIKI_PERPETUAL_FUTURES_LINK,
} from '../../../utils/classifiers';
import { ChainId } from '../../../types';
import { useWalletContext } from '@sovryn/react-wallet';
import { ProviderType } from '@sovryn/wallet';
import { AccountBalanceCard } from './components/AccountBalanceCard';
import { AccountDialog } from './components/AccountDialog';
import { NewPositionCard } from './components/NewPositionCard';
import { TradeDialog } from './components/TradeDialog';
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
import { OpenOrdersTable } from './components/OpenOrdersTable';
import { Tabs } from 'app/components/Tabs';
import { usePerpetual_isAddressWhitelisted } from './hooks/usePerpetual_isAddressWhitelisted';

export const PerpetualPageContainer: React.FC = () => {
  useInjectReducer({ key: sliceKey, reducer });
  useInjectSaga({ key: sliceKey, saga: perpetualPageSaga });

  const dispatch = useDispatch();
  const walletContext = useWalletContext();

  const {
    showAmmDepth,
    showChart,
    showRecentTrades,
    showTables,
    showTradeForm,
  } = useSelector(selectPerpetualPage);

  const { pairType, collateral } = useSelector(selectPerpetualPage);
  const { t } = useTranslation();

  const location = useLocation<IPromotionLinkState>();
  const history = useHistory<IPromotionLinkState>();

  const isAddressWhitelisted = usePerpetual_isAddressWhitelisted();

  useEffect(() => {
    dispatch(actions.setIsAddressWhitelisted(isAddressWhitelisted));
  }, [dispatch, isAddressWhitelisted]);

  const [linkPairType, setLinkPairType] = useState(
    location.state?.perpetualPair,
  );

  const pair = useMemo(
    () => PerpetualPairDictionary.get(linkPairType || pairType),
    [linkPairType, pairType],
  );

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

  const tables = useMemo(
    () => [
      {
        id: 'openPositions',
        label: t(translations.perpetualPage.openPositions),
        content: <OpenPositionsTable perPage={5} />,
      },
      {
        id: 'openOrders',
        label: t(translations.perpetualPage.openOrders),
        content: <OpenOrdersTable perPage={5} />,
      },
      {
        id: 'closedPositions',
        label: t(translations.perpetualPage.closedPositions),
        content: <ClosedPositionsTable perPage={5} />,
      },
      {
        id: 'orderHistory',
        label: t(translations.perpetualPage.orderHistory),
        content: <OrderHistoryTable perPage={5} />,
      },
      {
        id: 'fundingPayments',
        label: t(translations.perpetualPage.fundingPayments),
        content: <FundingPaymentsTable perPage={5} />,
      },
    ],
    [t],
  );

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
        <HeaderLabs
          helpLink={WIKI_PERPETUAL_FUTURES_LINK}
          // menus={
          //   <Link
          //     to="/perpetuals/competition"
          //     className="tw-mr-4 tw-text-black"
          //   >
          //     {t(translations.competitionPage.nav.competition)}
          //   </Link>
          // }
        />
        <div className="tw-relative tw--top-2.5 tw-w-full">
          <PairSelector
            pair={pair}
            collateral={collateral}
            onChange={onChangePair}
          />
          <ContractDetails pair={pair} />
        </div>
        <div className="tw-container tw-flex tw-flex-col tw-mt-5 tw-flex-grow">
          <div className="tw-flex tw-flex-col tw-mb-8 xl:tw-flex-row xl:tw-justify-start tw-items-stretch tw-flex-grow tw-h-full tw-space-y-2 xl:tw-space-y-0 xl:tw-space-x-2">
            {showAmmDepth && (
              <DataCard
                className="tw-min-w-72 tw-max-w-96"
                title={
                  <Trans
                    i18nKey={translations.perpetualPage.ammDepth.title}
                    components={[pairType.toString()]}
                  />
                }
                onClose={() => dispatch(actions.setShowAmmDepth(false))}
              >
                <AmmDepthChart pair={pair} />
              </DataCard>
            )}

            {showChart && (
              <DataCard
                className="tw-flex-1 tw-max-w-full tw-min-h-96"
                contentClassName="tw-flex tw-flex-col"
                title={
                  <Trans
                    i18nKey={translations.perpetualPage.chart.title}
                    components={[pairType.toString()]}
                  />
                }
                onClose={() => dispatch(actions.setShowChart(false))}
              >
                <TradingChart symbol={pair.chartSymbol} hasCustomDimensions />
              </DataCard>
            )}

            {showRecentTrades && (
              <DataCard
                className="2xl:tw-flex tw-min-w-72 tw-max-w-96 tw-min-h-72"
                title={
                  <Trans
                    i18nKey={translations.perpetualPage.recentTrades.title}
                    components={[pairType.toString()]}
                  />
                }
                contentClassName="tw-flex tw-flex-col"
                onClose={() => dispatch(actions.setShowRecentTrades(false))}
              >
                <RecentTradesTable pair={pair} />
              </DataCard>
            )}

            {showTradeForm && (
              <div className="tw-flex tw-flex-col tw-self-start tw-justify-start xl:tw-min-w-80 xl:tw-w-1/5 tw-space-y-2">
                <AccountBalanceCard />
                <NewPositionCard />
              </div>
            )}
          </div>

          {showTables && (
            <div className="tw-p-4 tw-bg-gray-2.5 tw-rounded-xl tw-mb-12">
              <Tabs
                items={tables}
                initial={tables[0].id}
                dataActionId="perpetual-tables"
              />
            </div>
          )}
        </div>
        <AccountDialog />
        <TradeDialog />
        <EditLeverageDialog />
        <EditMarginDialog />
        <ClosePositionDialog />
        <ToastsWatcher />
      </PerpetualQueriesContextProvider>
    </RecentTradesContextProvider>
  );
};
