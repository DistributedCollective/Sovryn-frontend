/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import { maintenanceStateSaga } from 'store/global/maintenance-store/saga';
import { actions as maintenanceActions, reducer as maintenanceReducer, maintenanceSlice } from 'store/global/maintenance-store/slice';
import { GlobalStyle } from 'styles/global-styles';
import { currentNetwork } from 'utils/classifiers';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { NetworkRibbon } from './components/NetworkRibbon/NetworkRibbon';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { EmailPage } from './containers/EmailPage';
import { MaintenancePage } from './containers/MaintenancePage';
import { StakePage } from './containers/StakePage/Loadable';
import { StatsPage } from './containers/StatsPage/Loadable';
import { SwapPage } from './containers/SwapPage/Loadable';
import { WalletPage } from './containers/WalletPage/Loadable';
import { WalletProvider } from './containers/WalletProvider';
import { useAppTheme } from './hooks/app/useAppTheme';
import { usePriceFeeds_tradingPairRates } from './hooks/price-feeds/usePriceFeeds_tradingPairRates';
import { useMaintenance } from './hooks/useMaintenance';
import { BorrowPage } from './pages/BorrowPage/Loadable';
import { BuySovPage } from './pages/BuySovPage/Loadable';
import { HomePage } from './pages/HomePage/Loadable';
import { LendingPage } from './pages/LendingPage/Loadable';
import { LiquidityMiningPage } from './pages/LiquidityMining/Loadable';
import { MarginTradePage } from './pages/MarginTradePage/Loadable';
import { OriginsLaunchpadPage } from './pages/OriginsLaunchpad/Loadable';
import { RewardPage } from './pages/RewardPage/Loadable';
import { SpotTradingPage } from './pages/SpotTradingPage/Loadable';

const title =
  currentNetwork !== 'mainnet' ? `Sovryn ${currentNetwork}` : 'Sovryn';

export function App() {
  useAppTheme();

  useInjectReducer({ key: maintenanceSlice, reducer: maintenanceReducer });
  useInjectSaga({ key: maintenanceSlice, saga: maintenanceStateSaga });
  const dispatch = useDispatch();

  const { checkMaintenance, States } = useMaintenance();
  const siteLocked = checkMaintenance(States.FULL);
  usePriceFeeds_tradingPairRates();

  useEffect(() => {
    dispatch(maintenanceActions.fetchMaintenance());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Helmet titleTemplate={`%s - ${title}`} defaultTitle={title}>
        <meta name="description" content="Sovryn Lending" />
      </Helmet>
      {siteLocked ? (
        <MaintenancePage />
      ) : (
        <WalletProvider>
          <NetworkRibbon />
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/buy-sov" component={BuySovPage} />
            <Route exact path="/trade" component={MarginTradePage} />
            <Route exact path="/swap" component={SwapPage} />
            <Route exact path="/spot" component={SpotTradingPage} />
            <Route exact path="/lend" component={LendingPage} />
            <Route exact path="/borrow" component={BorrowPage} />
            <Route exact path="/stake" component={StakePage} />
            <Route exact path="/stats" component={StatsPage} />
            <Redirect exact from="/liquidity" to="/yield-farm" />
            <Route exact path="/yield-farm" component={LiquidityMiningPage} />
            <Route exact path="/reward" component={RewardPage} />
            <Route exact path="/wallet" component={WalletPage} />
            <Route exact path="/origins" component={OriginsLaunchpadPage} />
            <Route
              exact
              path="/optin-success"
              render={props => <EmailPage {...props} type="OPTIN" />}
            />
            <Route
              exact
              path="/unsubscribe"
              render={props => <EmailPage {...props} type="UNSUBSCRIBE" />}
            />
            <Route component={NotFoundPage} />
          </Switch>
        </WalletProvider>
      )}
      <GlobalStyle />
    </BrowserRouter>
  );
}
