import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import merge from 'lodash.merge';
import cloneDeep from 'lodash.clonedeep';
import { useHistory } from 'react-router-dom';
import { useActions } from './context/actions';
import { PageContext, initialState } from './context/PageContext';
import { reducer } from './context/reducer';
import {
  FooterTypes,
  HeaderTypes,
  PageContextState,
  PageOptions,
} from './types';
import { DefaultHeaderComponent } from './components/DefaultHeaderComponent/DefaultHeaderComponent';
import { Footer } from './components/DefaultFooterComponent/DefaultFooterComponent';
import { FastBtcHeader } from 'app/pages/FastBtcPage/components/FastBtcHeader';
import UserWallet from 'app/pages/BridgeDepositPage/components/UserWallet';

type HeaderContainerProps = {
  pageOptions: PageOptions;
};

export const PageContainer: React.FC<Partial<HeaderContainerProps>> = ({
  children,
  pageOptions,
}) => {
  const [state, dispatch] = useReducer(
    reducer,
    merge(cloneDeep(initialState), { options: pageOptions }),
  );
  const actions = useActions(dispatch);
  const memoizedState = useMemo(() => state as PageContextState, [state]);
  const { options } = memoizedState;

  const history = useHistory();

  const resolveOptions = useCallback(
    (pathname: string) => {
      const initialOptions: PageOptions = merge(
        cloneDeep(initialState.options),
        pageOptions,
      );
      if (pathname.startsWith('/fast-btc')) {
        initialOptions.header = HeaderTypes.FAST_BTC;
        initialOptions.footer = FooterTypes.NONE;
      } else if (pathname.startsWith('/cross-chain')) {
        initialOptions.header = HeaderTypes.CROSS_CHAIN;
        initialOptions.footer = FooterTypes.NONE;
      } else if (pathname.startsWith('/perpetuals')) {
        initialOptions.header = HeaderTypes.LABS;
        initialOptions.footer = FooterTypes.DEFAULT;
      } else {
        initialOptions.header = HeaderTypes.DEFAULT;
        initialOptions.footer = FooterTypes.DEFAULT;
      }
      actions.setOptions(initialOptions);
    },
    [actions, pageOptions],
  );

  // reset options to default when route changes
  useEffect(() => {
    resolveOptions(history.location.pathname);
    return history.listen(route => resolveOptions(route.pathname));
  }, [history, actions, pageOptions, resolveOptions]);

  const maybeRenderHeader = useMemo(() => {
    switch (options.header) {
      case HeaderTypes.DEFAULT:
        return <DefaultHeaderComponent {...options.headerProps} />;
      case HeaderTypes.FAST_BTC:
        return <FastBtcHeader address={options.headerProps?.address} />;
      case HeaderTypes.CROSS_CHAIN:
        return <UserWallet address={options.headerProps?.address} />;
      case HeaderTypes.LABS:
        return <></>; // todo
      default:
        return null;
    }
  }, [options.header, options.headerProps]);

  const maybeRenderFooter = useMemo(() => {
    switch (options.footer) {
      case FooterTypes.DEFAULT:
        return <Footer {...options.footerProps} />;
      default:
        return null;
    }
  }, [options.footer, options.footerProps]);

  return (
    <PageContext.Provider value={{ state: memoizedState, actions }}>
      {maybeRenderHeader}
      {children}
      {maybeRenderFooter}
    </PageContext.Provider>
  );
};
