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
import { AssetsDictionary } from '../utils/blockchain/assets-dictionary';
import { createDrizzleAssets } from '../utils/blockchain/createDrizzle';
import { DrizzleProvider } from './containers/DrizzleProvider';
import { TradingHistoryPage } from './containers/TradingHistoryPage/Loadable';

export function App() {
  const assets = AssetsDictionary.assetList();
  const drizzle = createDrizzleAssets(assets);
  return (
    <BrowserRouter>
      <Helmet titleTemplate="%s - Sovryn" defaultTitle="Sovryn">
        <meta name="description" content="Sovryn Lending" />
      </Helmet>
      <DrizzleProvider drizzle={drizzle}>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/lend" component={LendingPage} />
          <Route exact path="/trade/:asset?" component={TradePage} />
          <Route exact path="/trading-history" component={TradingHistoryPage} />
          <Route exact path="/stats" component={StatsPage} drizzle={drizzle} />
          <Route component={NotFoundPage} />
        </Switch>
      </DrizzleProvider>
      <GlobalStyle />
    </BrowserRouter>
  );
}
