import type { useActions } from './context/actions';

export enum HeaderTypes {
  NONE,
  DEFAULT,
  FAST_BTC,
  CROSS_CHAIN,
  LABS,
  PERPETUALS,
}

export enum FooterTypes {
  NONE,
  DEFAULT,
}

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
  header: HeaderTypes;
  headerProps: Record<string, any>;
  footer: FooterTypes;
  footerProps: Record<string, any>;
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
