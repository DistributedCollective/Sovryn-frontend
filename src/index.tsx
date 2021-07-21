import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';

// Import root app
import { App } from 'app';

import { MetaMaskDiscouragementNotifyModal } from './app/components/MetaMaskDiscouragementNotifyModal/Loadable';
import { MobileBrowsersWarningDialog } from './app/components/MobileBrowsersWarningDialog/index';
import { ServiceWorkerToaster } from './app/components/ServiceWorkerToaster/Loadable';
import { store } from './store/store';

// Initialize languages
import './locales/i18n';
import './styles/index.css';
// Import scss global styles
import './styles/sass/styles.scss';
import '@sovryn/react-wallet/index.css';
/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import 'core-js/es/map';
import 'core-js/es/set';
import 'raf/polyfill';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

// if (process.env.REACT_APP_SENTRY_DSN) {
//   import('./sentry').then(({ default: sentryInit }) => sentryInit());
// }

const MOUNT_NODE = document.getElementById('root') as HTMLElement;

interface Props {
  Component: typeof App;
}
const ConnectedApp = ({ Component }: Props) => {
  return (
    <Provider store={store}>
      <HelmetProvider>
        {/*<React.StrictMode>*/}
        <Component />
        {/*</React.StrictMode>*/}
      </HelmetProvider>
      <ServiceWorkerToaster />
      <MobileBrowsersWarningDialog />
      <MetaMaskDiscouragementNotifyModal />
    </Provider>
  );
};
const render = (Component: typeof App) => {
  ReactDOM.render(<ConnectedApp Component={Component} />, MOUNT_NODE);
};

if (module.hot) {
  // Hot reloadable translation json files and app
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./app', './locales/i18n'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    const App = require('./app').App;
    render(App);
  });
}

render(App);
