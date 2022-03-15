import { createContext } from 'react';
import type { PageContextState, PageContextType } from '../types';

export const initialState: PageContextState = {
  options: {
    headerShown: true,
    footerShown: true,
  },
};

export const PageContext = createContext<PageContextType>({
  state: initialState,
  actions: {},
} as PageContextType);
