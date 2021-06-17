/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { translations } from 'locales/i18n';
import { maintenanceStateSaga } from 'store/global/maintenance-store/saga';
import {
  actions as maintenanceActions,
  reducer as maintenanceReducer,
  maintenanceSlice,
} from 'store/global/maintenance-store/slice';
import { GlobalStyle } from 'styles/global-styles';
import { currentNetwork } from 'utils/classifiers';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { NetworkRibbon } from './components/NetworkRibbon/NetworkRibbon';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { EmailPage } from './containers/EmailPage';
import { LendBorrow } from './containers/LendBorrowSovryn/Loadable';
import { MaintenancePage } from './containers/MaintenancePage';
import { StakePage } from './containers/StakePage/Loadable';
import { StatsPage } from './containers/StatsPage/Loadable';
import { SwapPage } from './containers/SwapPage/Loadable';
import { WalletPage } from './containers/WalletPage/Loadable';
import { WalletProvider } from './containers/WalletProvider';
import { useAppTheme } from './hooks/app/useAppTheme';
import { usePriceFeeds_tradingPairRates } from './hooks/price-feeds/usePriceFeeds_tradingPairRates';
import { useMaintenance } from './hooks/useMaintenance';
import { Babelfish } from './pages/Babelfish/Loadable';
import { BuySovPage } from './pages/BuySovPage/Loadable';
import { LiquidityMiningPage } from './pages/LiquidityMining/Loadable';
import { MarginTradePage } from './pages/MarginTradePage/Loadable';
import { OriginsLaunchpadPage } from './pages/OriginsLaunchpad/Loadable';
import { RewardPage } from './pages/RewardPage/Loadable';
import { SpotTradingPage } from './pages/SpotTradingPage/Loadable';
import './_overlay.scss';

const title =
  currentNetwork !== 'mainnet' ? `Sovryn ${currentNetwork}` : 'Sovryn';

export function App() {
  useAppTheme();
  useInjectReducer({ key: maintenanceSlice, reducer: maintenanceReducer });
  useInjectSaga({ key: maintenanceSlice, saga: maintenanceStateSaga });
  const dispatch = useDispatch();
  const { checkMaintenance, States } = useMaintenance();
  const siteLocked = checkMaintenance(States.FULL);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [prevLocation, setLocation] = useState(
    window.location.pathname.split('/')[1],
  );
  const { t } = useTranslation();
  const timeout = { entter: 800, exit: 400 };
  usePriceFeeds_tradingPairRates();
  const currentKey = window.location.pathname.split('/')[1];
  useEffect(() => {
    dispatch(maintenanceActions.fetchMaintenance());
  }, [dispatch]);
  useEffect(() => {
    setLocation(currentKey);
  }, [currentKey]);

  return (
    <BrowserRouter>
      <Helmet titleTemplate={`%s - ${title}`} defaultTitle={title}>
        <meta name="description" content="Sovryn Lending" />
      </Helmet>
      {siteLocked ? (
        <MaintenancePage message={t(translations.maintenance.full)} />
      ) : (
        <WalletProvider>
          <NetworkRibbon />
          <TransitionGroup component="div">
            <CSSTransition
              key={currentKey}
              timeout={timeout}
              className="pageSlider"
              mountOnEnter={false}
              unmountOnExit={true}
            >
              <div className="left">
                <Switch>
                  <Route exact path="/" component={BuySovPage} />
                  <Route exact path="/babelfish" component={Babelfish} />
                  <Route exact path="/buy-sov" component={BuySovPage} />
                  <Route exact path="/trade" component={MarginTradePage} />
                  <Route exact path="/swap" component={SwapPage} />
                  <Route exact path="/spot" component={SpotTradingPage} />
                  <Route exact path="/lend" component={LendBorrow} />
                  <Route exact path="/stake" component={StakePage} />
                  <Route exact path="/stats" component={StatsPage} />
                  <Redirect exact from="/liquidity" to="/yield-farm" />
                  <Route
                    exact
                    path="/yield-farm"
                    component={LiquidityMiningPage}
                  />
                  <Route exact path="/reward" component={RewardPage} />
                  <Route exact path="/wallet" component={WalletPage} />
                  <Route
                    exact
                    path="/origins"
                    component={OriginsLaunchpadPage}
                  />
                  <Route
                    exact
                    path="/optin-success"
                    render={props => <EmailPage {...props} type="OPTIN" />}
                  />
                  <Route
                    exact
                    path="/unsubscribe"
                    render={props => (
                      <EmailPage {...props} type="UNSUBSCRIBE" />
                    )}
                  />
                  <Route component={NotFoundPage} />
                </Switch>
              </div>
            </CSSTransition>
          </TransitionGroup>
        </WalletProvider>
      )}
      <GlobalStyle />
    </BrowserRouter>
  );
}
