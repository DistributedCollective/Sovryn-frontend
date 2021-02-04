/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import { GlobalStyle } from 'styles/global-styles';

import { EngageWalletDialog } from './containers/EngageWalletDialog/Loadable';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { StatsPage } from './containers/StatsPage/Loadable';
import { WalletProvider } from './containers/WalletProvider';
import { LiquidityPage } from './containers/LiquidityPage/Loadable';
import { currentNetwork } from '../utils/classifiers';
import LendBorrowSovryn from './containers/LendBorrowSovryn';
import { TradingPage } from './containers/TradingPage/Loadable';
import { SandboxPage } from './containers/SandboxPage/Loadable';
import { EmailPage } from './containers/EmailPage';
import { WalletPage } from './containers/WalletPage';
import { SalesPage } from './containers/SalesPage';
import { MarginTradePage } from './containers/MarginTradePage/Loadable';

const title =
  currentNetwork !== 'mainnet' ? `Sovryn ${currentNetwork}` : 'Sovryn';

function getFaviconEl(): HTMLLinkElement {
  return document.getElementById('favicon') as HTMLLinkElement;
}

function resolveColorScheme() {
  try {
    return window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } catch (e) {
    return 'light';
  }
}

export function App() {
  const [theme, setTheme] = useState(resolveColorScheme());
  useEffect(() => {
    try {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', e => {
          setTheme(e.matches ? 'dark' : 'light');
        });
    } catch (e) {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    // add white favicon for dark mode.
    const fav = getFaviconEl();
    fav.href = theme === 'dark' ? '/favicon-white.png' : '/favicon.png';
    fav.type = 'image/png';
    fav.sizes.add('48x48');
  }, [theme]);

  return (
    <BrowserRouter>
      <Helmet titleTemplate={`%s - ${title}`} defaultTitle={title}>
        <meta name="description" content="Sovryn Lending" />
      </Helmet>
      <WalletProvider>
        <Switch>
          <Route exact path="/trade" component={MarginTradePage} />
          <Route exact path="/" component={TradingPage} />
          <Route exact path="/lend" component={LendBorrowSovryn} />
          <Route exact path="/stats" component={StatsPage} />
          <Route exact path="/liquidity" component={LiquidityPage} />
          <Route exact path="/sandbox" component={SandboxPage} />
          <Route exact path="/wallet" component={WalletPage} />
          <Route exact path="/genesis" component={SalesPage} />
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
        <EngageWalletDialog />
      </WalletProvider>
      <GlobalStyle />
    </BrowserRouter>
  );
}
