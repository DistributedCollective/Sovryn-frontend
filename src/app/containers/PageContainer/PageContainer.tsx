import React, { useLayoutEffect, useMemo, useReducer } from 'react';
import merge from 'lodash.merge';
import cloneDeep from 'lodash.clonedeep';
import { useHistory } from 'react-router-dom';
import { useActions } from './context/actions';
import { PageContext, initialState } from './context/PageContext';
import { reducer } from './context/reducer';
import { PageContextState, PageOptions } from './types';
import { HeaderContainer } from './components/HeaderContainer';
import { FooterContainer } from './components/FooterContainer';
import { usePageViews } from 'app/hooks/useAnalytics';

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

  // reset options to default when route changes
  useLayoutEffect(() => {
    return history.listen(() =>
      actions.clearOptions(merge(cloneDeep(initialState.options), pageOptions)),
    );
  }, [history, actions, pageOptions]);

  usePageViews();

  return (
    <PageContext.Provider value={{ state: memoizedState, actions }}>
      {options.headerShown && (
        <HeaderContainer state={memoizedState} actions={actions} />
      )}
      {children}
      {options.footerShown && (
        <FooterContainer state={memoizedState} actions={actions} />
      )}
    </PageContext.Provider>
  );
};
