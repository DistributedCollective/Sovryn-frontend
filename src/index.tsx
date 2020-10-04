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
import * as serviceWorker from 'serviceWorker';

// Import scss global styles
import './styles/sass/styles.scss';

// Import root app
import { App } from 'app';

import { HelmetProvider } from 'react-helmet-async';

import { store } from './store/store';

// Initialize languages
import './locales/i18n';
import { useCallback, useEffect } from 'react';
import { bottomRightToaster } from './utils/toaster';
import { currentChainId } from './utils/classifiers';

const MOUNT_NODE = document.getElementById('root') as HTMLElement;

interface Props {
  Component: typeof App;
}
const ConnectedApp = ({ Component }: Props) => {
  // todo move this to dedicated component.
  const onUpdateNotification = useCallback(registration => {
    const waitingWorker = registration && registration.waiting;
    bottomRightToaster.show(
      {
        intent: 'primary',
        message: (
          <>
            <p className="mb-0">
              <strong>App was updated.</strong>
            </p>
            <p className="mb-0">Refresh page to use latest version.</p>
          </>
        ),
        action: {
          onClick: () => {
            waitingWorker &&
              waitingWorker.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
          },
          text: 'Refresh',
        },
        timeout: 0,
      },
      'app-updated',
    );
  }, []);

  // useEffect(() => {
  //   if (currentChainId === 30) {
  //     bottomRightToaster.show({
  //       intent: 'warning',
  //       message: 'Nodes are having issues. The system only partly working.',
  //       timeout: 0,
  //     });
  //   }
  // }, []);

  useEffect(() => {
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.register({
      onUpdate: registration => onUpdateNotification(registration),
    });
    // eslint-disable-next-line
  }, []);

  return (
    <Provider store={store}>
      <HelmetProvider>
        {/*<React.StrictMode>*/}
        <Component />
        {/*</React.StrictMode>*/}
      </HelmetProvider>
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
