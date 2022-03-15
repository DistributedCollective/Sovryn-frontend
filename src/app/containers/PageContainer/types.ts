import React from 'react';
import type { useActions } from './context/actions';

export type PageContextState = {
  options: Partial<PageOptions>;
};

export type PageContextType = {
  state: PageContextState;
  actions: ReturnType<typeof useActions>;
};

export enum PageContextActionType {
  SET_OPTIONS,
  CLEAR_OPTIONS,
}

export type PageOptions = {
  headerShown?: boolean;
  // render custom header
  header?: (props: PageContextType) => React.ReactNode;
  footerShown?: boolean;
  // render custom footer
  footer?: (props: PageContextType) => React.ReactNode;
};

export type PageContextAction =
  | {
      type: PageContextActionType.SET_OPTIONS;
      value: Partial<PageOptions>;
    }
  | {
      type: PageContextActionType.CLEAR_OPTIONS;
      value: Partial<PageOptions>;
    };
