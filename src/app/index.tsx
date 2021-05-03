/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import { GlobalStyle } from 'styles/global-styles';
import { currentNetwork } from 'utils/classifiers';

import { useAppTheme } from './hooks/app/useAppTheme';
import { useMaintenance } from './hooks/useMaintenance';
import { NetworkRibbon } from './components/NetworkRibbon/NetworkRibbon';
import { MaintenancePage } from './containers/MaintenancePage';
import { WalletProvider } from './containers/WalletProvider';

import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { StatsPage } from './containers/StatsPage/Loadable';
import { LiquidityPage } from './containers/LiquidityPage/Loadable';
import { TradingPage } from './containers/TradingPage/Loadable';
import { SandboxPage } from './containers/SandboxPage/Loadable';
import { EmailPage } from './containers/EmailPage';
import { WalletPage } from './containers/WalletPage/Loadable';
import { BuySovPage } from './pages/BuySovPage/Loadable';
import { LendBorrow } from './containers/LendBorrowSovryn/Loadable';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
  actions as maintenanceActions,
  maintenanceSlice,
  reducer as maintenanceReducer,
} from 'store/global/maintenance-store/slice';
import { maintenanceStateSaga } from 'store/global/maintenance-store/saga';
import { useDispatch } from 'react-redux';

const title =
  currentNetwork !== 'mainnet' ? `Sovryn ${currentNetwork}` : 'Sovryn';

export function App() {
  useAppTheme();

  useInjectReducer({ key: maintenanceSlice, reducer: maintenanceReducer });
  useInjectSaga({ key: maintenanceSlice, saga: maintenanceStateSaga });
  const dispatch = useDispatch();

  const { checkMaintenance } = useMaintenance();
  const siteLocked = checkMaintenance('full');

  useEffect(() => {
    dispatch(maintenanceActions.fetchMaintenance());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Helmet titleTemplate={`%s - ${title}`} defaultTitle={title}>
        <meta name="description" content="Sovryn Lending" />
      </Helmet>
      {siteLocked?.maintenance_active ? (
        <MaintenancePage message={siteLocked?.message} />
      ) : (
        <WalletProvider>
          <NetworkRibbon />
          <Switch>
            <Route exact path="/" component={BuySovPage} />
            <Route exact path="/trade" component={TradingPage} />
            <Route exact path="/lend" component={LendBorrow} />
            <Route exact path="/stats" component={StatsPage} />
            <Route exact path="/liquidity" component={LiquidityPage} />
            <Route exact path="/sandbox" component={SandboxPage} />
            <Route exact path="/wallet" component={WalletPage} />
            {/*<Route exact path="/escrow" component={EscrowPage} />*/}
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
