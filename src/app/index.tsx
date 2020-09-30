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

import { HomePage } from './containers/HomePage/Loadable';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { LendingPage } from './containers/LendingPage/Loadable';
import { TradePage } from './containers/TradePage/Loadable';
import { StatsPage } from './containers/StatsPage/Loadable';
import { TradingHistoryPage } from './containers/TradingHistoryPage/Loadable';
import { WalletProvider } from './containers/WalletProvider';
import { LiquidityPage } from './containers/LiquidityPage/Loadable';

export function App() {
  return (
    <BrowserRouter>
      <Helmet titleTemplate="%s - Sovryn" defaultTitle="Sovryn">
        <meta name="description" content="Sovryn Lending" />
      </Helmet>
      <WalletProvider>
        <Switch>
          {/*<Route exact path="/" component={HomePage} />*/}
          <Route exact path="/" component={TradePage} />
          <Route exact path="/lend" component={LendingPage} />
          <Route exact path="/trade/:asset?" component={TradePage} />
          <Route exact path="/trading-history" component={TradingHistoryPage} />
          <Route exact path="/stats" component={StatsPage} />
          <Route exact path="/liquidity" component={LiquidityPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </WalletProvider>
      <GlobalStyle />
    </BrowserRouter>
  );
}
