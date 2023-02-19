/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';

import { currentNetwork, isMainnet } from 'utils/classifiers';
import { useAppTheme } from './hooks/app/useAppTheme';
import { useMaintenance } from './hooks/useMaintenance';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
  actions as maintenanceActions,
  maintenanceSlice,
  reducer as maintenanceReducer,
} from 'store/global/maintenance-store/slice';
import { maintenanceStateSaga } from 'store/global/maintenance-store/saga';
import { useDispatch } from 'react-redux';

import { NetworkRibbon } from './components/NetworkRibbon/NetworkRibbon';
import { MaintenancePage } from './containers/MaintenancePage';
import { WalletProvider } from './containers/WalletProvider';

import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { EmailPage } from './containers/EmailPage';
import { PortfolioPage } from './pages/PortfolioPage/Loadable';

import { SwapPage } from './containers/SwapPage/Loadable';
import { RewardPage } from './pages/RewardPage/Loadable';
import { BorrowPage } from './pages/BorrowPage/Loadable';
import { LendingPage } from './pages/LendingPage/Loadable';
import { StakePage } from './containers/StakePage/Loadable';

import { LandingPage } from './pages/LandingPage/Loadable';
import { BuySovPage } from './pages/BuySovPage/Loadable';

import { LiquidityMiningPage } from './pages/LiquidityMining/Loadable';
import { MarginTradePage } from './pages/MarginTradePage/Loadable';
import { SpotTradingPage } from './pages/SpotTradingPage/Loadable';
import { OriginsLaunchpadPage } from './pages/OriginsLaunchpad/Loadable';
import { OriginsClaimPage } from './pages/OriginsClaimPage/Loadable';
import { BridgeDepositPage } from './pages/BridgeDepositPage/Loadable';
import { BridgeWithdrawPage } from './pages/BridgeWithdrawPage/Loadable';
import { FastBtcPage } from './pages/FastBtcPage/Loadable';
import { PageContainer } from './containers/PageContainer';
import 'react-toastify/dist/ReactToastify.css';
import { ReceiveRBTCPage } from './pages/ReceiveRBTCPage';
import { usePriceFeeds_tradingPairRates } from './hooks/price-feeds/usePriceFeeds_tradingPairRates';

const title = !isMainnet ? `Sovryn ${currentNetwork}` : 'Sovryn';

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
        <>
          <WalletProvider>
            <PageContainer>
              <NetworkRibbon />
              <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/buy-sov" component={BuySovPage} />
                <Route exact path="/trade" component={MarginTradePage} />
                <Route exact path="/swap" component={SwapPage} />
                <Route exact path="/spot" component={SpotTradingPage} />
                <Route exact path="/lend" component={LendingPage} />
                <Route exact path="/borrow" component={BorrowPage} />
                <Route exact path="/stake" component={StakePage} />
                <Redirect exact from="/liquidity" to="/yield-farm" />
                <Redirect exact from="/perpetuals" to="/" />
                <Route
                  exact
                  path="/yield-farm"
                  component={LiquidityMiningPage}
                />
                <Route exact path="/rewards" component={RewardPage} />
                <Redirect exact path="/wallet" to="/portfolio" />
                <Route exact path="/portfolio" component={PortfolioPage} />
                <Route exact path="/origins" component={OriginsLaunchpadPage} />
                <Route
                  exact
                  path="/origins/claim"
                  component={OriginsClaimPage}
                />
                <Route
                  exact
                  path="/cross-chain/deposit"
                  component={BridgeDepositPage}
                />
                <Route
                  exact
                  path="/cross-chain/withdraw"
                  component={BridgeWithdrawPage}
                />
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
                <Route
                  exact
                  path="/fast-btc/:type/:network?"
                  component={FastBtcPage}
                />
                <Route exact path="/rbtc/" component={ReceiveRBTCPage} />
                <Route component={NotFoundPage} />
              </Switch>
            </PageContainer>
          </WalletProvider>
        </>
      )}
    </BrowserRouter>
  );
}
