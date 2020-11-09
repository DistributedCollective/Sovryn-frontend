/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import { GlobalStyle } from 'styles/global-styles';

import { NotFoundPage } from './components/NotFoundPage/Loadable';
// import { LendingPage } from './containers/LendingPage/Loadable';
import { StatsPage } from './containers/StatsPage/Loadable';
import { TradingHistoryPage } from './containers/TradingHistoryPage/Loadable';
import { WalletProvider } from './containers/WalletProvider';
import { LiquidityPage } from './containers/LiquidityPage/Loadable';
import { currentNetwork } from '../utils/classifiers';
import LendBorrowSovryn from './containers/LendBorrowSovryn';
import { TradingPage } from './containers/TradingPage/Loadable';
import { SandboxPage } from './containers/SandboxPage/Loadable';
import { FastBtcPage } from './containers/FastBtcPage/Loadable';
import { EmailOptInSuccessPage } from './containers/EmailOptInSuccessPage';

const title =
  currentNetwork !== 'mainnet' ? `Sovryn ${currentNetwork}` : 'Sovryn';

export function App() {
  return (
    <BrowserRouter>
      <Helmet titleTemplate={`%s - ${title}`} defaultTitle={title}>
        <meta name="description" content="Sovryn Lending" />
      </Helmet>
      <WalletProvider>
        <Switch>
          <Route exact path="/" component={TradingPage} />
          <Route exact path="/lend" component={LendBorrowSovryn} />
          <Route exact path="/fast-btc" component={FastBtcPage} />
          <Route exact path="/trading-history" component={TradingHistoryPage} />
          <Route exact path="/stats" component={StatsPage} />
          <Route exact path="/liquidity" component={LiquidityPage} />
          <Route exact path="/sandbox" component={SandboxPage} />
          <Route
            exact
            path="/optin-success"
            component={EmailOptInSuccessPage}
          />
          <Route component={NotFoundPage} />
        </Switch>
      </WalletProvider>
      <GlobalStyle />
    </BrowserRouter>
  );
}
