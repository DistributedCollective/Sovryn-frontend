/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

// Import scss global styles
import './styles/sass/styles.scss';

// Import root app
import { App } from 'app';

import { HelmetProvider } from 'react-helmet-async';

import { store } from './store/store';

// Initialize languages
import './locales/i18n';
import { ServiceWorkerToaster } from './app/components/ServiceWorkerToaster/Loadable';

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
